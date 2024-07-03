import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { IRequest } from 'src/common/typings/request.js';
import { CheckBalanceParams, CreateOrderParams, PayNotifyDto, ReportUsageParams } from './payment.interface.js';
import { PaymentService } from './payment.service.js';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('/check-balance')
  public async checkBalance(@Req() req: IRequest, @Body() dto: CheckBalanceParams) {
    const { context } = req;
    return this.paymentService.checkBalance(dto, context);
  }

  @Get('/get-balance')
  public async getBalance(@Req() req: IRequest) {
    const { context } = req;
    return this.paymentService.getBalance(context);
  }

  @Post('/report-usage')
  public async reportUsage(@Req() req: IRequest, @Body() dto: ReportUsageParams) {
    const { context } = req;
    return this.paymentService.reportUsage(dto, context);
  }

  @Post('/orders')
  async createOrder(@Req() req: IRequest, @Body() dto: CreateOrderParams) {
    const { context } = req;
    return this.paymentService.createOrder(dto, context);
  }

  @Post('/wx-notify')
  async getWxNotify(@Body() body: PayNotifyDto) {
    return this.paymentService.wxNotify(body);
  }
}
