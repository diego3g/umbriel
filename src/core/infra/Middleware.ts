import { HttpResponse } from './HttpResponse'

export interface Middleware<T = any, U = any> {
  handle: (httpRequest: T, httpBody?: U) => Promise<HttpResponse | false>
}
