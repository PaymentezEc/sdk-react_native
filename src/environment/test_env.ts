import { ConfigBase } from './base_config';

export default class TestEnv extends ConfigBase {
  environment: string = 'DEV';
  urlBase: string = 'https://ccapi-stg.paymentez.com';
  urlCresBase: string = 'https://nuvei-cres-dev-bkh4atahdegxa8dk.eastus-01.azurewebsites.net/'
}
