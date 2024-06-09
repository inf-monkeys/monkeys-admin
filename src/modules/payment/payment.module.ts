import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller.js';
import { PaymentService } from './payment.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BalanceEntity } from '../../database/entities/pricing/balance.entity.js';
import { ConsumeRecordsEntity } from '../../database/entities/pricing/consume-records.entity.js';
import { ToolsEntity } from '../../database/entities/tools/tools.entity.js';

@Module({
  controllers: [PaymentController],
  providers: [PaymentService],
  imports: [TypeOrmModule.forFeature([BalanceEntity, ConsumeRecordsEntity, ToolsEntity])],
})
export class PaymentModule {}
