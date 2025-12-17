import { AxiosAdapter } from './adapters/axios.adapter';
import Environment from '../environment/environment';
import generateAuthToken from '../utils/NuveiUtils';
import type { ErrorModel } from '../interfaces';

export interface interceptorHttp {
  endpoint: string;
  methodHttp: string;
  queryParams?: {};
  secretCode: string;
  secretKey: string;
  body?: {};
  tokenCres: string;
  isCress: boolean
}

export default class InterceptorHttp {
  endpoint: string;
  methodHttp: string;
  queryParams?: {};
  secretCode: string = '';
  secretKey: string = '';
  tokenCres: string = '';
  body?: {};
  isCress : boolean = false;
  private client!: AxiosAdapter;

  constructor({
    endpoint,
    methodHttp,
    queryParams,
    secretCode,
    secretKey,
    body,
    tokenCres,
    isCress,
  }: interceptorHttp) {
    this.endpoint = endpoint;
    this.methodHttp = methodHttp;
    this.secretKey = secretKey;
    this.secretCode = secretCode;
    this.queryParams = queryParams;
    this.body = body;
    this.tokenCres = tokenCres;
    this.isCress = isCress;
  }

  public async init(): Promise<void> {
    const token = (this.isCress) ?  this.tokenCres : await generateAuthToken(this.secretKey, this.secretCode);
    console.log(token);
    console.log(this.isCress);
    const urlBase = this.isCress ? Environment.getInstance().baseConfig?.urlCresBase ||'':  Environment.getInstance().baseConfig?.urlBase || '';
    this.client = new AxiosAdapter({
      baseUrl:urlBase,
      headers:(this.isCress)? {
        "Authorization" : `Bearer ${token}`,
        'Content-Type': 'application/json',
      }:{
        'Auth-Token': token,
        'Content-Type': 'application/json',
      },
    });
  }

  public async request<T>(): Promise<T> {
    if (!this.client) {
      throw {
        error: {
          type: 'Client not initializated',
          help: '',
          description: 'Call init() before making a request',
        },
      } as ErrorModel;
    }

    try {
      switch (this.methodHttp) {
        case 'GET':
          return await this.client.get<T>(this.endpoint, {
            params: this.queryParams,
          });
        case 'POST':
          return await this.client.post<T>(
            this.endpoint,
            { params: this.queryParams },
            this.body
          );
        default:
          return await this.client.get<T>(this.endpoint, {
            params: this.queryParams,
          });
      }
    } catch (error: any) {
      throw error as ErrorModel;
    }
  }
}
