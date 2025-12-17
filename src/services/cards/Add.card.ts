import NuveiSdk from "../../NuveiSdk";
import type { ErrorModel } from "../../interfaces";
import type { AddCardRequest, AddCardResponse } from "../interfaces/addCard.interface";





export async function addCard(request: AddCardRequest): Promise<AddCardResponse> {
  // Validación inicial
  if (!request) {
    throw {
      error: {
        type: "invalid_input",
        help: "",
        description: "request is required",
      },
    } as ErrorModel;
  }

  if (!NuveiSdk.isInitialized()) {
    throw {
      error: {
        type: "sdk_not_initialized",
        help: "SDK not initialized",
        description: "Nuvei SDK must be initialized before use",
      },
    } as ErrorModel;
  }

  const interceptor = NuveiSdk.createInterceptor(
    "/v2/card/add",
    "POST",
    {},
    request,
    false
  );

  // Inicializar interceptor
  await interceptor.init();

  // Ejecutar request
  const response = await interceptor.request<AddCardResponse | ErrorModel>();

  // --- 🔥 VALIDAR SI ES ERROR ---
  if ((response as any)?.error) {
    throw response; // ⬅️ ahora sí lanza el error como debe ser
  }

  return response as AddCardResponse;
}