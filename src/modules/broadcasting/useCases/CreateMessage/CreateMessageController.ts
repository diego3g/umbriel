import { Controller } from '@core/infra/Controller'
import {
  HttpResponse,
  clientError,
  created,
  fail,
} from '@core/infra/HttpResponse'

import { CreateMessage } from './CreateMessage'

type CreateMessageControllerRequest = {
  subject: string
  body: string
  templateId?: string
  senderId: string
  tags: string[]
}

export class CreateMessageController implements Controller {
  constructor(private createMessage: CreateMessage) {}

  async handle({
    subject,
    body,
    templateId,
    senderId,
    tags,
  }: CreateMessageControllerRequest): Promise<HttpResponse> {
    try {
      // TODO: Add validation

      const result = await this.createMessage.execute({
        subject,
        body,
        tags,
        templateId,
        senderId,
      })

      if (result.isLeft()) {
        const error = result.value

        return clientError(error)
      } else {
        return created()
      }
    } catch (err) {
      return fail(err)
    }
  }
}
