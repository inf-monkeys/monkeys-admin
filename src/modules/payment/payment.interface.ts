export interface CheckBalanceParams {
  toolName: string;
}

export interface CheckBalanceResponse {
  success: boolean;
  message: string;
}

export interface ReportUsageParams {
  toolName: string;
  usage: {
    takes: number;
    tokenCount: number;
  };
}

export interface CreateOrderParams {
  amount: number;
}

export class PayNotifyDto {
  id: string;
  create_time: string;
  event_type: 'TRANSACTION.SUCCESS' | 'REFUND.SUCCESS' | 'REFUND.ABNORMAL' | 'REFUND.CLOSED';
  resource_type: 'encrypt-resource';
  resource: {
    algorithm: 'AEAD_AES_256_GCM';
    ciphertext: string;
    original_type: 'transaction';
    nonce: string;
    associated_data: string;
  };
  summary: string;
}