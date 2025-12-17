//Request to create a debit with/whitout Verify

import type { CardResponse, ThreeDsResponse } from "./generic.interface";

//Base Case
export interface DebitPaymentRequest {
  session_id?: string;
  user: UserPaymentRequest;
  order: OrderPaymentRequest;
  card: CardPaymentRequest;
  extra_params?: ExtraParamsRequest;
}

export interface OrderPaymentRequest {
  amount: number;
  description: string;
  dev_reference: string;
  vat: number;
  taxable_amount: number;
  tax_percentage: number;
  installments?: number;
  installments_type?: number;
  months_grace?: number;
}

export interface UserPaymentRequest {
  id: string;
  first_name?: string;
  last_name?: string;
  email: string;
  phone?: string;
  ip_address?: string;
  fiscal_number?: string;
}

export interface CardPaymentRequest {
  token?: string;
  cvc?: string;
}

export interface ExtraParamsRequest {
  threeDS2_data: ThreeDS2;
  browser_info: BrowserInfo3ds;
}

export interface ThreeDS2 {
  term_url: string;
  device_type: string;
  reference_id: string;
}

export interface BrowserInfo3ds {
  ip: string;
  language: string;
  java_enable: boolean;
  js_enable: boolean;
  color_depth: number;
  screen_height: number;
  screen_width: number;
  timezone_offset: number;
  user_agent: string;
  accept_header: string;
}

//Payment Response Interface

export interface PaymentDebitResponse {
  'transaction': TransactionResponse;
  'card': CardResponse;
  '3ds'?: ThreeDsResponse;
}

export interface TransactionResponse {
  status: string;
  current_status: string;
  payment_date: Date;
  amount: number;
  authorization_code: string;
  installments: number;
  dev_reference: string;
  message: string;
  carrier_code: string;
  id: string;
  status_detail: number;
  installments_type?: string;
  payment_method_type?: string;
  product_description?: string;
}




