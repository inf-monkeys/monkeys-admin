import { Module } from '@nestjs/common';
import { WxpayGatewayService } from './wxpay.service.js';

@Module({
  imports: [],
  controllers: [],
  providers: [WxpayGatewayService],
  exports: [WxpayGatewayService],
})
export class WxpayGatewaysModule {}
