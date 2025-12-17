export interface PaymentRequest {
  user: userPayment;
  order: OrderPayment;
  card: CardPayment;
}

export interface userPayment {
  id: string;
  email: string;
}

export interface OrderPayment {
  amount: number;
  description: string;
  dev_reference: string;
  vat: number;
  taxable_amount: number;
  tax_percentage: number;
}

export interface CardPayment {
  token: string;
}
