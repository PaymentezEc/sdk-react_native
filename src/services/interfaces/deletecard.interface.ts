export interface DeleteRequest {
  card: {
    token: string;
  };
  user: {
    id: string;
  };
}

export interface DeleteCardResponse {
  message: string;
}
