import NuveiSdk from "../../NuveiSdk";
import type { CresLoginResponse, cresDataResponse, cresGeneralResponse } from "../interfaces/cres.interface";




export async function loginCres(clientId: string, clientSecret: string): Promise<CresLoginResponse> {
    if (!clientId || !clientSecret) {
        throw {
            error: {
                type: 'Invalid input',
                help: '',
                description: 'the clienId and clientSecret are required but are emptys',
            },
        };
    }

    const interceptor = NuveiSdk.createInterceptor(
        'api/auth/login', 
        'POST', 
        {}, 
        {
        "clientId": clientId,
        "clientSecret": clientSecret
        },
        false,
        true,
        ''
    );


    await interceptor.init();
    const response = await interceptor.request<CresLoginResponse>();
    console.log('response', response);
    return response;
}


export async function createCresReference(token: string): Promise<cresGeneralResponse> {
    if (!token) {
        throw {
            error: {
                type: 'Invalid input',
                help: '',
                description: 'token is required but is empty',
            },
        };
    }
    const interceptor = NuveiSdk.createInterceptor(
        'api/cres/createreference', 'POST', {}, {},
        false,
        true,
        token
    );


    await interceptor.init();
    const response = await interceptor.request<cresGeneralResponse>();
    console.log('response', response);
    return response;
}


export async function cresGetData(token: string, id: string): Promise<cresDataResponse> {
    if (!token || !id) {
        throw {
            error: {
                type: 'Invalid input',
                help: '',
                description: 'token and id are required but are emptys',
            },
        };
    }
    const interceptor = NuveiSdk.createInterceptor(
        `api/cres/get/${id}`, 'GET', {}, {},
        false,
        true,
        token
    );


    await interceptor.init();
    const response = await interceptor.request<cresDataResponse>();
    console.log('response', response);
    return response;
}




export async function confirmCres(token: string, id: string): Promise<cresDataResponse> {
    if (!token || !id) {
        throw {
            error: {
                type: 'Invalid input',
                help: '',
                description: 'token and id are required but are emptys',
            },
        };
    }
    const interceptor = NuveiSdk.createInterceptor(
        `api/cres/confirm`, 'POST', {}, {
            "id": id
        },
        false,
        true,
        token
    );


    await interceptor.init();
    const response = await interceptor.request<cresDataResponse>();
    console.log('response', response);
    return response;
}


