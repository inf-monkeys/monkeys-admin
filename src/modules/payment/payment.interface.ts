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
