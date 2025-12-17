export interface CardListItem {
  bin: string;
  status: string;
  token: string;
  holder_name: string;
  expiry_year: string;
  expiry_month: string;
  transaction_reference: string | null;
  type: string;
  number: string;
  image?: string;
}

export  interface ListCardResponse {
  cards: CardListItem[];
  result_size: number;
}
