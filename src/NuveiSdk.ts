import Environment from './environment/environment';
import InterceptorHttp from './http/interceptor';
import type { ErrorModel } from './interfaces';




class NuveiSdk {
  private static instance: NuveiSdk;
  private environment: Environment | null = null;

  private constructor() {}

  public static getInstance(): NuveiSdk {
    if (!NuveiSdk.instance) {
      NuveiSdk.instance = new NuveiSdk();
    }
    return NuveiSdk.instance;
  }

  public initEnvironmet(
    appCode: string,
    appKey: string,
    serverCode: string,
    serverKey: string,
    testMode: boolean,
    termUrl: string,
    clientId: string,
    clientSecret: string
  ): void {
    Environment.getInstance().initConfig(
      appCode,
      appKey,
      serverCode,
      serverKey,
      testMode,
      termUrl,
      clientId,
      clientSecret
    );
    // this.environment?.initConfig(appCode, appKey, serverCode, serverKey, testMode);
    this.environment = Environment.getInstance();
    console.log('Ambiente inicializado', this.environment.baseConfig?.urlBase);
  }

  public isInitialized(): boolean {
    return !!this.environment && !!this.environment.baseConfig?.urlBase;
  }

  public createInterceptor(
    endpoint: string,
    methodHttp: string,
    queryParams: {},
    body: any,
    credentialServer: boolean = true,
    isCres: boolean = false,
    tokenCres?: string,
  ): InterceptorHttp {
    if (!this.isInitialized()) {
      throw {
        error: {
          type: 'sdk_not_initialized',
          help: 'SDK not initialized',
          description: 'Call initEnvironment before using the SDK',
        },
      } as ErrorModel;
    }
    const { appCode, appKey, serverCode, serverKey } = this.environment!;
    return new InterceptorHttp({
      endpoint: endpoint,
      methodHttp: methodHttp,
      body: body,
      queryParams: queryParams,
      secretCode: credentialServer ? serverCode : appCode,
      secretKey: credentialServer ? serverKey : appKey,
      tokenCres: tokenCres??'',
      isCress: isCres
    });
  }
}

export default NuveiSdk.getInstance();
