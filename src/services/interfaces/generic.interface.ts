export interface BrowserResponse {
    hidden_iframe: string;
    challenge_request: string;
  }



export interface SDKResponse {
    acs_trans_id:         string;
    acs_signed_content:   null;
    acs_reference_number: string;
}


export interface Authentication3ds {
    status: string;
    return_message: string;
    version: null;
    xid: string;
    reference_id: string;
    cavv: null;
    return_code: string;
    eci: null;
  }


  export interface ThreeDsResponse {
    sdk_response: SDKResponse;
    authentication: Authentication3ds;
    browser_response: BrowserResponse;
  }
  

  export interface CardResponse {
    number: string;
    bin: string;
    type: string;
    transaction_reference: string;
    status: string;
    token: string;
    expiry_year: string;
    expiry_month: string;
    origin: string;
    bank_name?: string;
    message?: string;
  }