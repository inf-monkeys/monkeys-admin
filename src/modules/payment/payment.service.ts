import { Injectable, Logger } from '@nestjs/common';
import { CheckBalanceParams, CheckBalanceResponse, CreateOrderParams, GetOrderParams, PayNotifyDto, ReportUsageParams } from './payment.interface.js';
import { InjectRepository } from '@nestjs/typeorm';
import { BalanceEntity } from '../../database/entities/pricing/balance.entity.js';
import { Repository } from 'typeorm';
import { PricingRule, ToolsEntity } from '../../database/entities/tools/tools.entity.js';
import { ConsumeRecordsEntity, ConsumeRecordStatus, ConsumeRecordType } from '../../database/entities/pricing/consume-records.entity.js';
import { config } from '../../common/config/index.js';
import { generateDbId } from '../../common/utils/index.js';
import { IContext } from '../../common/typings/request.js';
import { OrdersEntity, PaymentStatus } from '../../database/entities/pricing/orders.entity.js';
import { WxpayGatewayService } from '../gateways/wxpay/wxpay.service.js';
import { RechargeRecordsEntity } from '../../database/entities/pricing/recharge-record.entity.js';

import * as math from 'mathjs';
import { logger } from '../../common/logger/index.js';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(BalanceEntity) private readonly balanceRepository: Repository<BalanceEntity>,
    @InjectRepository(ToolsEntity) private readonly toolsRepository: Repository<ToolsEntity>,
    @InjectRepository(ConsumeRecordsEntity) private readonly consumeRecordsRepository: Repository<ConsumeRecordsEntity>,
    @InjectRepository(OrdersEntity) private readonly ordersRepository: Repository<OrdersEntity>,
    @InjectRepository(RechargeRecordsEntity) private readonly rechargeRecordsRepository: Repository<RechargeRecordsEntity>,
    private readonly wxpayGatewayService: WxpayGatewayService,
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

  public async getBalance(context: IContext) {
    const { teamId } = context;
    const balanceEntity = await this.getOrInitTeamBalance(teamId);
    return {
      success: true,
      message: 'Balance fetched',
      data: { amount: Math.floor(balanceEntity.balance), totalConsume: await this.getTotalConsume(teamId), totalReCharge: await this.getTotalReCharge(teamId) },
    };
  }

  public async getTotalConsume(teamId: string): Promise<number> {
    const consumeRecords = await this.consumeRecordsRepository.find({ where: { teamId, isDeleted: false } });
    return consumeRecords.reduce((acc, record) => acc + record.amount, 0);
  }

  public async getTotalReCharge(teamId: string): Promise<number> {
    const rechargeRecords = await this.rechargeRecordsRepository.find({ where: { teamId, isDeleted: false } });
    return rechargeRecords.reduce((acc, record) => acc + record.changedBalance, 0);
  }

  public async reportUsage(params: ReportUsageParams, context: IContext): Promise<void> {
    logger.info('Report usage: ', params, context);
    const {
      toolName,
      usage: { takes = 0, tokenCount = 0, success },
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

    if (success) {
      logger.info('Pricing rule: ', pricingRule);
      logger.info('Unit price: ', unitPrice);
      let amount = 0;
      if (pricingRule === PricingRule.PER_EXECUTR) {
        amount = unitPrice;
      } else if (pricingRule === PricingRule.PER_1K_TOKEN) {
        logger.info('Token count: ', tokenCount);
        if (typeof tokenCount !== 'number' || tokenCount < 0) {
          Logger.warn('Received a invalid token count: ', tokenCount);
        } else {
          amount = Math.floor(unitPrice * (tokenCount / 1000));
        }
      } else if (pricingRule === PricingRule.PER_1MIN) {
        amount = Math.floor(unitPrice * (takes / 1000 / 60));
      }

      logger.info('Amount: ', amount);
      balanceEntity.balance -= amount;
      balanceEntity.updatedTimestamp = +new Date();
      logger.info('New balance: ', balanceEntity.balance);
      await this.balanceRepository.save(balanceEntity);

      const consumeRecord = await this.consumeRecordsRepository.findOne({ where: { teamId, status: ConsumeRecordStatus.PENDING, taskId: context.taskId } });
      if (consumeRecord) {
        consumeRecord.status = ConsumeRecordStatus.SUCCESS;
        consumeRecord.amount = amount;
        consumeRecord.updatedTimestamp = +new Date();
        await this.consumeRecordsRepository.save(consumeRecord);
      }
    } else {
      const consumeRecord = await this.consumeRecordsRepository.findOne({ where: { teamId, status: ConsumeRecordStatus.PENDING, taskId: context.taskId } });
      if (consumeRecord) {
        consumeRecord.status = ConsumeRecordStatus.FAILED;
        consumeRecord.amount = 0;
        consumeRecord.updatedTimestamp = +new Date();
        await this.consumeRecordsRepository.save(consumeRecord);
      }
    }
  }

  public async getOrders(teamId: string, params: GetOrderParams) {
    const { types, page, limit } = params;
    const queryTypes = types.split(',');

    const orders = [];
    let total = 0;

    if (queryTypes.includes('recharge')) {
      const [data, count] = await this.ordersRepository.findAndCount({
        where: { teamId },
        skip: (+page - 1) * +limit,
        take: +limit,
        order: { createdTimestamp: 'DESC' },
      });
      orders.push(...data);
      total += count;
    }

    if (queryTypes.includes('execute_tool')) {
      const [data, count] = await this.consumeRecordsRepository.findAndCount({
        where: { teamId, type: ConsumeRecordType.EXECUTE_TOOL },
        skip: (+page - 1) * +limit,
        take: +limit,
        order: { createdTimestamp: 'DESC' },
      });
      orders.push(...data);
      total += count;
    }

    return {
      success: true,
      data: orders,
      total,
      message: 'Orders fetched',
    };
  }

  public async getOrderById(orderId: string) {
    const order = await this.ordersRepository.findOne({ where: { id: orderId } });
    return {
      success: true,
      data: order,
      message: 'Order fetched',
    };
  }

  public async createOrder(params: CreateOrderParams, context: IContext) {
    let { amount } = params;
    if (isNaN(Number(amount)) || amount <= 0 || amount.toString().includes('.')) {
      Logger.warn('Received a invalid amount: ', amount);
      return {
        success: false,
        message: 'Invalid amount: ' + amount,
      };
    }

    amount = Math.floor(amount);

    const entity: Partial<OrdersEntity> = {
      id: generateDbId(),
      isDeleted: false,
      createdTimestamp: +new Date(),
      updatedTimestamp: +new Date(),
      teamId: context.teamId,
      userId: context.userId,
      platform: 'wxpay',
      status: PaymentStatus.PENDING,
      amount,
    };

    entity.qrcode = await this.wxpayGatewayService.createWxOrder(amount, entity.id);

    await this.ordersRepository.save(entity);

    return {
      success: true,
      data: entity,
      message: 'Order created',
    };
  }

  public async closeOrder(orderId: string) {
    const order = await this.ordersRepository.findOne({ where: { id: orderId } });
    if (!order) {
      return {
        success: false,
        message: 'Order not found',
      };
    }

    order.status = PaymentStatus.CLOSED;

    await this.wxpayGatewayService.closeOrder(orderId);

    await this.ordersRepository.save(order);

    return {
      success: true,
      data: order,
      message: 'Order closed',
    };
  }

  public async wxNotify(body: PayNotifyDto) {
    if (body.event_type === 'TRANSACTION.SUCCESS') {
      const { ciphertext, associated_data: associatedData, nonce } = body.resource;
      const result: any = this.wxpayGatewayService.decipher(ciphertext, associatedData, nonce);
      if (typeof result?.out_trade_no !== 'string') {
        Logger.warn('wxNotify, Invalid out_trade_no: ', result?.out_trade_no);
        return {
          success: false,
          message: 'Payment failed, invalid out_trade_no',
        };
      }

      const paymentId: string = result.out_trade_no;
      const payment = await this.ordersRepository.findOne({ where: { id: paymentId, status: PaymentStatus.PENDING } });
      if (!payment) {
        Logger.warn('wxNotify, Payment not found: ', paymentId);
        return {
          success: false,
          message: 'Payment not found',
        };
      }

      payment.status = PaymentStatus.PAID;
      logger.info('wxNotify, Payment paid: ', paymentId, 'Payload: ', result);
      await this.ordersRepository.save(payment);

      await this.changeBalance(payment.teamId, payment.userId, payment.amount, '用户充值', payment.id);

      payment.status = PaymentStatus.DELIVERED;
      await this.ordersRepository.save(payment);

      return {
        success: true,
        data: payment,
        message: 'Payment success',
      };
    }
  }

  public async changeBalance(teamId: string, userId: string, changedBalance: number, remark?: string, paymentId?: string) {
    changedBalance = Math.floor(changedBalance);

    const balanceEntity = await this.getOrInitTeamBalance(teamId);

    const newBalance = math.chain(balanceEntity.balance).add(changedBalance).done();

    balanceEntity.balance = newBalance;
    balanceEntity.updatedTimestamp = +new Date();
    await this.balanceRepository.save(balanceEntity);

    const rechargeRecord: Partial<RechargeRecordsEntity> = {
      id: generateDbId(),
      isDeleted: false,
      createdTimestamp: +new Date(),
      updatedTimestamp: +new Date(),
      teamId,
      userId,
      paymentId,
      changedBalance,
      remainBalance: newBalance,
      remark,
    };
    await this.rechargeRecordsRepository.save(rechargeRecord);
  }

  public async getToolPrice() {
    const tools = await this.toolsRepository.find({ where: { isDeleted: false } });
    return {
      success: true,
      data: tools.map((tool) => ({ name: tool.name, unitPrice: tool?.unitPrice ?? 0, pricingRule: tool?.pricingRule ?? PricingRule.FREE })),
      message: 'Tool price fetched',
    };
  }
}
