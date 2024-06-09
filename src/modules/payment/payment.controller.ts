import { Body, Controller, Post, Req } from '@nestjs/common';
import { IRequest } from 'src/common/typings/request.js';
import { CheckBalanceParams, ReportUsageParams } from './payment.interface.js';
import { PaymentService } from './payment.service.js';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('/check-balance')
  public async checkBalance(@Req() req: IRequest, @Body() dto: CheckBalanceParams) {
    const { context } = req;
    return this.paymentService.checkBalance(dto, context);
  }

  @Post('/report-usage')
  public async reportUsage(@Req() req: IRequest, @Body() dto: ReportUsageParams) {
    const { context } = req;
    return this.paymentService.reportUsage(dto, context);
  }
}
