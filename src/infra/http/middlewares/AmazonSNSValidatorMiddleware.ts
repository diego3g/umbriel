import request from 'request'
import SNSValidator from 'sns-validator'
import { promisify } from 'util'

import { fail, HttpResponse, ok } from '@core/infra/HttpResponse'
import { Middleware } from '@core/infra/Middleware'

const snsValidator = new SNSValidator()
const validateSNSMessage = promisify(snsValidator.validate).bind(snsValidator)

const promiseRequest = promisify(request)

export class AmazonSNSValidatorMiddleware implements Middleware {
  async handle(_: any, body: any): Promise<HttpResponse | false> {
    try {
      if (process.env.NODE_ENV === 'production') {
        await validateSNSMessage(body)
      }

      switch (body.Type) {
        case 'SubscriptionConfirmation':
        case 'UnsubscribeConfirmation':
          await promiseRequest(body.SubscribeURL)

          return false
        default:
          return ok()
      }
    } catch (error) {
      return fail(error)
    }
  }
}
