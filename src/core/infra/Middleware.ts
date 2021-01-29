import { HttpResponse } from './HttpResponse'

export interface Middleware<T = any> {
  handle: (httpRequest: T) => Promise<HttpResponse>
}
