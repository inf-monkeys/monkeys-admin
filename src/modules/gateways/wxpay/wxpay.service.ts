import { config } from '../../../common/config/index.js'
import { Injectable } from '@nestjs/common';
import WxPay from 'wechatpay-node-v3';

@Injectable()
export class WxpayGatewayService {
  public pay: WxPay;
  constructor() {
    if (config.payment.wxpay.appid) {
      this.pay = new WxPay({
        appid: config.payment.wxpay.appid,
        mchid: config.payment.wxpay.mchid,
        publicKey: Buffer.from(config.payment.wxpay.publicKey),
        privateKey: Buffer.from(config.payment.wxpay.privateKey),
      });
    }
  }

  public async createWxOrder(amount: number, outTradeNumber: string, description = config.payment.wxpay.orderDesc) {
    if (!this.pay) return;
    const params = {
      description,
      out_trade_no: outTradeNumber,
      notify_url: config.payment.wxpay.notifyUrl,
      amount: {
        total: amount,
      },
    };
    const result = await this.pay.transactions_native(params);
    const { status, data } = result;
    console.log('wxpay result: ', result);
    if (status === 200 && data) {
      return data as string;
    }
    throw new Error('下单失败');
  }

  public decipher(ciphertext: string, associated_data: string, nonce: string) {
    if (!this.pay) return;
    return this.pay.decipher_gcm(ciphertext, associated_data, nonce, config.payment.wxpay.v3key);
  }
}
