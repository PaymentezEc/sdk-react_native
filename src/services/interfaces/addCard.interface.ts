import type { CardResponse } from "./generic.interface";

export interface AddCardRequest {
  session_id?: string;
  user: UserInfoAdd;
  card: CardInfoAdd;
  extra_params?: ExtraParams;
  billing_address?: BillingAddress;
}

export interface UserInfoAdd {
  id: string;
  email: string;
  phone?: string;
  ip_address?: string;
  fiscal_number?: string;
}

export interface CardInfoAdd {
  number: string;
  holder_name: string;
  expiry_month: number;
  expiry_year: number;
  cvc: string;
  type?: string;
  account_type?: 'C' | 'R' | 'A';
}

/** Parámetros extra opcionales */
export interface ExtraParams {
  threeDS2_data?: ThreeDS2Data;
  browser_info?: BrowserInfo;
  auth_data?: AuthData;
}

/** Datos de 3DS2 */
export interface ThreeDS2Data {
  term_url: string;
  device_type: 'browser' | 'SDK';
  process_anyway?: boolean;
  reference_id?: string;
}

/** Información del navegador */
export interface BrowserInfo {
  ip?: string;
  language?: string;
  java_enabled?: boolean;
  js_enabled?: boolean;
  color_depth?: number;
  screen_height?: number;
  screen_width?: number;
  timezone_offset?: number;
  user_agent?: string;
  accept_header?: string;
}

/** Datos de autenticación */
export interface AuthData {
  cavv: string;
  xid?: string;
  eci: string;
  version: string;
  reference_id: string;
  status: 'Y' | 'N' | 'U' | 'A' | 'R' | 'C';
}

/** Dirección de facturación */
export interface BillingAddress {
  first_name?: string;
  last_name?: string;
  street?: string;
  city?: string;
  state?: string;
  district?: string;
  zip?: string;
  house_number?: string;
  country?: string;
  additional_address_info?: string;
}

export interface AddCardResponse {
  card: CardResponse;
  "3ds": The3Ds;
  transaction: TransactionInfo
}


export interface TransactionInfo{
  status_detail?: number
}

export interface The3Ds {
  authentication:   Authentication;
  browser_response: BrowserResponse;
  sdk_response:     SDKResponse;
}

export interface Authentication {
  status:         string;
  return_message: string;
  version:        string;
  xid:            string;
  reference_id:   string;
  cavv:           null;
  return_code:    string;
  eci:            string;
}

export interface BrowserResponse {
  challenge_request: string;
  hidden_iframe:     string;
}

export interface SDKResponse {
  acs_trans_id:         string;
  acs_signed_content:   string;
  acs_reference_number: string;
}