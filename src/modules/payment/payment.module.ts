import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller.js';
import { PaymentService } from './payment.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BalanceEntity } from '../../database/entities/pricing/balance.entity.js';
import { ConsumeRecordsEntity } from '../../database/entities/pricing/consume-records.entity.js';
import { ToolsEntity } from '../../database/entities/tools/tools.entity.js';
import { OrdersEntity } from '../../database/entities/pricing/orders.entity.js';
import { RechargeRecordsEntity } from '../../database/entities/pricing/recharge-record.entity.js';
import { WxpayGatewaysModule } from '../gateways/wxpay/wxpay.module.js';

@Module({
  controllers: [PaymentController],
  providers: [PaymentService],
  imports: [TypeOrmModule.forFeature([BalanceEntity, ConsumeRecordsEntity, ToolsEntity, OrdersEntity, RechargeRecordsEntity]), WxpayGatewaysModule],
})
export class PaymentModule {}
