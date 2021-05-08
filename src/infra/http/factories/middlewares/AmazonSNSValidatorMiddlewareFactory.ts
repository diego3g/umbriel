import { Middleware } from '@core/infra/Middleware'
import { AmazonSNSValidatorMiddleware } from '@infra/http/middlewares/AmazonSNSValidatorMiddleware'

export function makeAmazonSNSValidatorMiddleware(): Middleware {
  const amazonSNSValidatorMiddleware = new AmazonSNSValidatorMiddleware()

  return amazonSNSValidatorMiddleware
}
