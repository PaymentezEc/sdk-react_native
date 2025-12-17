export abstract class HttpAdapter {
  abstract get<T>(url: string, options?: Record<string, any>): Promise<T>;

  abstract post<T>(
    url: string,
    options?: Record<string, any>,
    data?: any
  ): Promise<T>;
}
