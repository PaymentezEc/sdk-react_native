


export interface CresLoginResponse{
    access_token: string,
    tokenType: string, 
    expiresIn: number,
    name: String,
}


export interface cresGeneralResponse{
    status: boolean,
    id: string,
    message: string
}

export interface cresDataResponse{
    data: Data,
    confirmed: boolean
}

export interface Data{
    cres?: string,
    transStatus?: string
}