import type { OtpRequest, OtpResponse } from "..";
import NuveiSdk from "../../NuveiSdk";



export async function verify(request: OtpRequest): Promise<OtpResponse> {

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
        '/v2/transaction/verify',
        'POST',
        {},
        request,
        false
      );

      await interceptor.init();
      const response = await interceptor.request<OtpResponse>();
    

      return response;

}