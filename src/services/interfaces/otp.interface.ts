
import type { ThreeDsResponse } from "./generic.interface"




export interface OtpRequest{
    user?: otpUser,
    transaction?: otpTransaction
    type?: "BY_OTP"| "BY_CRES" |"AUTHENTICATION_CONTINUE" |"BY_AMOUNT"| "BY_AUTH_CODE"
    value?: string
    more_info?: boolean
}

export interface otpUser{
    id: string
}

export interface otpTransaction{
    id: string
}

//Response 
export interface OtpResponse {
    status?:         number;
    payment_date?:   Date;
    amount?:         number;
    transaction_id?: string;
    status_detail?:  number;
    message?:        string;
    transaction?: TransactionOtpResponse;
    card?:        CardOtpResponse;
    "3ds"?:       ThreeDsResponse;
}







export interface CardOtpResponse {
    bin:                   string;
    status:                string;
    token:                 string;
    expiry_year:           string;
    expiry_month:          string;
    transaction_reference: string;
    type:                  string;
    number:                string;
    origin:                string;
}

export interface TransactionOtpResponse {
    amount:             number;
    authorization_code: null;
    carrier:            string;
    carrier_code:       null;
    current_status:     null;
    dev_reference:      string;
    id:                 string;
    installments:       number;
    installments_type:  string;
    message:            null;
    payment_date:       null;
    payment_method_type: string;
    product_description: string;
    status:             string;
    status_detail:      number;
}