import NuveiSdk from "../../NuveiSdk";
import type { DeleteRequest, DeleteCardResponse } from "..";



export async function deleteCard(request: DeleteRequest): Promise<DeleteCardResponse>{
    if (!request) {
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
        '/v2/card/delete',
        'POST',
        {},
        request,
        true
      );
      await interceptor.init();
      const response = await interceptor.request<DeleteCardResponse>();
      return response;     
}