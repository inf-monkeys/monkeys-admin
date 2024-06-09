import { Injectable, Logger } from '@nestjs/common';
import { CheckBalanceParams, CheckBalanceResponse, ReportUsageParams } from './payment.interface.js';
import { InjectRepository } from '@nestjs/typeorm';
import { BalanceEntity } from '../../database/entities/pricing/balance.entity.js';
import { Repository } from 'typeorm';
import { PricingRule, ToolsEntity } from '../../database/entities/tools/tools.entity.js';
import { ConsumeRecordStatus, ConsumeRecordType, ConsumeRecordsEntity } from '../../database/entities/pricing/consume-records.entity.js';
import { config } from '../../common/config/index.js';
import { generateDbId } from '../../common/utils/index.js';
import { IContext } from 'src/common/typings/request.js';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(BalanceEntity) private readonly balanceRepository: Repository<BalanceEntity>,
    @InjectRepository(ToolsEntity) private readonly toolsRepository: Repository<ToolsEntity>,
    @InjectRepository(ConsumeRecordsEntity) private readonly consumeRecordsRepository: Repository<ConsumeRecordsEntity>,
  ) {}

  public async getOrInitTeamBalance(teamId: string): Promise<BalanceEntity> {
    const balanceEntity = await this.balanceRepository.findOne({ where: { teamId, isDeleted: false } });
    if (balanceEntity) {
      return balanceEntity;
    }
    const entity: Partial<BalanceEntity> = { id: generateDbId(), isDeleted: false, createdTimestamp: +new Date(), updatedTimestamp: +new Date(), teamId, balance: config.pricing.defaultBalance };
    await this.balanceRepository.save(entity);
    return entity as BalanceEntity;
  }

  private async initConsumeRecord(teamId: string, toolName: string, context: IContext): Promise<void> {
    const entity: Partial<ConsumeRecordsEntity> = {
      id: generateDbId(),
      isDeleted: false,
      createdTimestamp: +new Date(),
      updatedTimestamp: +new Date(),
      teamId,
      userId: context.userId,
      type: ConsumeRecordType.EXECUTE_TOOL,
      status: ConsumeRecordStatus.PENDING,
      amount: 0,
      workflowId: context.workflowId,
      workflowInstanceId: context.workflowInstanceId,
      taskId: context.taskId,
      toolName,
    };
    await this.consumeRecordsRepository.save(entity);
  }

  public async checkBalance(params: CheckBalanceParams, context: IContext): Promise<CheckBalanceResponse> {
    const { toolName } = params;
    const { teamId } = context;
    const balanceEntity = await this.getOrInitTeamBalance(teamId);
    const tool = await this.toolsRepository.findOne({ where: { isDeleted: false, name: toolName } });
    if (!tool) {
      return {
        success: false,
        message: 'Tool not found',
      };
    }

    const { pricingRule, unitPrice } = tool;
    if (pricingRule === PricingRule.FREE) {
      return {
        success: true,
        message: 'Tool is free',
      };
    }

    const success = balanceEntity.balance >= unitPrice;
    await this.initConsumeRecord(teamId, toolName, context);
    return {
      success,
      message: success ? 'Balance is enough' : 'Balance is not enough',
    };
  }

  public async reportUsage(params: ReportUsageParams, context: IContext): Promise<void> {
    Logger.log('Report usage: ', params, context);
    const {
      toolName,
      usage: { takes = 0, tokenCount = 0 },
    } = params;
    const { teamId } = context;
    const balanceEntity = await this.getOrInitTeamBalance(teamId);
    const tool = await this.toolsRepository.findOne({ where: { isDeleted: false, name: toolName } });
    if (!tool) {
      return;
    }

    const { pricingRule, unitPrice } = tool;
    if (pricingRule === PricingRule.FREE) {
      return;
    }
    Logger.log('Pricing rule: ', pricingRule);
    Logger.log('Unit price: ', unitPrice);
    let amount = 0;
    if (pricingRule === PricingRule.PER_EXECUTR) {
      amount = unitPrice;
    } else if (pricingRule === PricingRule.PER_1K_TOKEN) {
      Logger.log('Token count: ', tokenCount);
      if (typeof tokenCount !== 'number' || tokenCount < 0) {
        Logger.warn('Received a invalid token count: ', tokenCount);
      } else {
        amount = Math.floor(unitPrice * (tokenCount / 1000));
      }
    } else if (pricingRule === PricingRule.PER_1MIN) {
      amount = Math.floor(unitPrice * (takes / 1000));
    }

    Logger.log('Amount: ', amount);
    balanceEntity.balance -= amount;
    balanceEntity.updatedTimestamp = +new Date();
    Logger.log('New balance: ', balanceEntity.balance);
    await this.balanceRepository.save(balanceEntity);

    const consumeRecord = await this.consumeRecordsRepository.findOne({ where: { teamId, status: ConsumeRecordStatus.PENDING, taskId: context.taskId } });
    if (consumeRecord) {
      consumeRecord.status = ConsumeRecordStatus.SUCCESS;
      consumeRecord.amount = amount;
      consumeRecord.updatedTimestamp = +new Date();
      await this.consumeRecordsRepository.save(consumeRecord);
    }
  }
}
