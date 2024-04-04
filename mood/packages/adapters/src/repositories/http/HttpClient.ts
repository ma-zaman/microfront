export interface HttpClient {
  get<T>(url: string, headers?: Record<string, string>): Promise<T>
  post<T>(url: string, body: Object, headers?: Record<string, string>): Promise<T>
  put<T>(url: string, body: Object, headers?: Record<string, string>): Promise<T>
  delete(url: string, headers?: Record<string, string>): Promise<void>
}
