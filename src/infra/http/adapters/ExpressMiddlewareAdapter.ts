import { Request, Response, NextFunction } from 'express'

import { Middleware } from '@core/infra/Middleware'

export const adaptMiddleware = (middleware: Middleware) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const request = {
      accessToken: req.headers?.['x-access-token'],
      ...(req.headers || {}),
    }

    const httpResponse = await middleware.handle(request)

    if (httpResponse.statusCode === 200) {
      Object.assign(req, httpResponse.body)

      return next()
    } else {
      return res.status(httpResponse.statusCode).json({
        error: httpResponse.body.error,
      })
    }
  }
}
