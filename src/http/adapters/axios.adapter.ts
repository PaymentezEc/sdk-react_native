import axios, { type AxiosInstance } from 'axios';
import { HttpAdapter } from './http.adapter';
import type { ErrorModel } from '../../interfaces';

interface Options {
  baseUrl: string;

  headers: Record<string, any>;
}

export class AxiosAdapter extends HttpAdapter {
  private axiosInstance: AxiosInstance;

  constructor(options: Options) {
    super();
    console.log(options.headers);
    this.axiosInstance = axios.create({
      baseURL: options.baseUrl,
      headers: options.headers,
    });
  }

  async get<T>(
    url: string,
    options?: Record<string, any> | undefined
  ): Promise<T> {
    try {
      console.log(options);
      const response = await this.axiosInstance.get<T>(url, options);
      console.log(response);
      return response.data;
    } catch (error: any) {
      console.log('entra aqui');
      const errorResponse: ErrorModel = this.normalizeError(error, url, 'GET');
      throw errorResponse;
    }
  }
  async post<T>(
    url: string,
    options?: Record<string, any> | undefined,
    body?: any
  ): Promise<T> {
    try {
      console.log(options);
      const response = await this.axiosInstance.post<T>(url, body, options);
      console.log(response);
      return response.data;
    } catch (error: any) {
      const errorResponse: ErrorModel = this.normalizeError(error, url, 'POST');
      throw errorResponse;
    }
  }

  private normalizeError(error: any, url: string, method: string): ErrorModel {
    console.log(error.response);
    if (error.response?.data.error) {
      const apiError = error.response.data.error;
      return {
        error: {
          type: apiError.type || 'api_error',
          help: apiError.help || '',
          description:
            apiError.description ||
            `Error in request ${method} request to ${url}`,
        },
      };
    }

    return {
      error: {
        type: 'network_error',
        help: 'Network error',
        description: `Failed to perform ${method} request to ${url}`,
      },
    };
  }
}
