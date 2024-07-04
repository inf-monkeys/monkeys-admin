import { Body, Controller, Delete, Get, Param, Post, Req } from '@nestjs/common';
import { IRequest } from 'src/common/typings/request.js';
import { CheckBalanceParams, CreateOrderParams, GetOrderParams, PayNotifyDto, ReportUsageParams } from './payment.interface.js';
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

  @Post('/get-orders')
  public async getOrders(@Req() req: IRequest, @Body() dto: GetOrderParams) {
    const { context } = req;
    return this.paymentService.getOrders(context.teamId, dto);
  }

  @Get('/orders/:orderId')
  public async getOrder(@Param('orderId') orderId: string) {
    return this.paymentService.getOrderById(orderId);
  }

  @Post('/orders')
  async createOrder(@Req() req: IRequest, @Body() dto: CreateOrderParams) {
    const { context } = req;
    return this.paymentService.createOrder(dto, context);
  }

  @Delete('/orders/:orderId')
  public async closeOrder(@Param('orderId') orderId: string) {
    return this.paymentService.closeOrder(orderId);
  }

  @Post('/wx-notify')
  async getWxNotify(@Body() body: PayNotifyDto) {
    return this.paymentService.wxNotify(body);
  }
}
