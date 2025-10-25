import { ConfigBase } from './base_config';

export default class ProdEnv extends ConfigBase {
  environment: string = 'PROD';
  urlBase: string = 'https://ccapi.paymentez.com';
  urlCresBase: string = 'https://nuvei-cres-dev-bkh4atahdegxa8dk.eastus-01.azurewebsites.net/';
}
