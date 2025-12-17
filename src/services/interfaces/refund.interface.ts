export interface RefundResponse {
  status: string;
  transaction: TransactionRefundResponse;
  detail?: string;
  card?: CardRefundResponse;
}

export interface CardRefundResponse {
  bin: string;
  status: string;
  token: string;
  expiry_year: string;
  expiry_month: string;
  transaction_reference: string;
  type: string;
  number: string;
  origin: string;
}

export interface TransactionRefundResponse {
  status: string;
  payment_date: string;
  authorization_code: string;
  refund_amount: number;
  dev_reference: string;
  carrier_code: any;
  status_detail: number;
  amount: number;
  installments: number;
  message: string;
  id: string;
}

//Refun request by diferent case

export interface TransactionByReference {
  reference_label: number;
}

export interface TransactionById {
  id: string;
}
export interface OrderTransaction {
  amount: number;
}

export interface RefundRequestById {
  transaction: TransactionById;
}

export interface RefunRequestPartialAmount {
  transaction: TransactionById;
  order: OrderTransaction;
}

export interface RefundRequestByReference {
  transaction: TransactionByReference;
}

export interface RefundRequestWihtMoreInfo {
  transaction: TransactionById;
  order: OrderTransaction;
  more_info: boolean;
}

export type RefundRequest =
  | RefundRequestById
  | RefunRequestPartialAmount
  | RefundRequestByReference
  | RefundRequestWihtMoreInfo;
