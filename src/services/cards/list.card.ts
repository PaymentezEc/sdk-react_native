// src/services/cards/listCards.ts

import NuveiSdk from "../../NuveiSdk";
import type {ListCardResponse} from "..";
import { getIconCard } from "../../components/PaymentGatewayForm/helpers";


export async function listCards(userId: string): Promise<ListCardResponse> {
  if (!userId) {
    throw {
      error: {
        type: 'Invalid input',
        help: '',
        description: 'uid is required but is empty',
      },
    };
  }
  if (!NuveiSdk.isInitialized()) {
    throw {
      error: {
        type: 'sdk_not_initialized',
        help: 'SDK not initialized',
        description: 'Nuvei SDK must be initialized before use',
      },
    };
  }
  const interceptor = NuveiSdk.createInterceptor(
    '/v2/card/list',
    'GET',
    { uid: userId },
    true
  );
  await interceptor.init();
  const response = await interceptor.request<ListCardResponse>();
  const validCards = response.cards.filter((card) => card.status === 'valid');
  const listCard = validCards.map((card) => {

    const { icon } = getIconCard(card.type);
    console.log(icon)
    card.image = icon;
    return card;
  });
  return { ...response, cards: listCard };
}
