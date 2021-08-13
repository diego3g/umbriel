import { Middleware } from '@core/infra/Middleware'
import { AmazonSNSValidatorMiddleware } from '@infra/sns-webhook/middlewares/AmazonSNSValidatorMiddleware'

export function makeAmazonSNSValidatorMiddleware(): Middleware {
  const amazonSNSValidatorMiddleware = new AmazonSNSValidatorMiddleware()

  return amazonSNSValidatorMiddleware
}
