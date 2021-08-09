import { Controller } from '@core/infra/Controller'
import { HttpResponse, fail, ok, clientError } from '@core/infra/HttpResponse'
import { ValidEventTypes } from '@modules/broadcasting/domain/event/type'

import { RegisterEvent } from './RegisterEvent'

type RegisterEventControllerRequest = {
  Message: string
}

export class RegisterEventController implements Controller {
  constructor(private registerEvent: RegisterEvent) {}

  async handle(
    requestData: RegisterEventControllerRequest
  ): Promise<HttpResponse> {
    try {
      const data = JSON.parse(requestData.Message)

      const eventTypesMap: Record<string, ValidEventTypes> = {
        Delivery: 'DELIVER',
        Bounce: 'BOUNCE',
        Reject: 'REJECT',
        Complaint: 'COMPLAINT',
        Click: 'CLICK',
        Open: 'OPEN',
      }

      const eventMetaMap = {
        Delivery: 'delivery',
        Bounce: 'bounce',
        Reject: 'reject',
        Complaint: 'complaint',
        Click: 'click',
        Open: 'open',
      }

      if (!data.mail?.tags.contactId[0] || !data.mail?.tags.messageId[0]) {
        return ok()
      }

      const type = eventTypesMap[data.eventType]
      const meta = data[eventMetaMap[data.eventType]]

      if (type === 'OPEN' && meta?.userAgent?.includes('GoogleImageProxy')) {
        return ok()
      }

      let importantMetadata: any = {}

      switch (type) {
        case 'OPEN':
          importantMetadata = {
            ipAddress: meta.ipAddress,
            userAgent: meta.userAgent,
          }
          break
        case 'CLICK':
          importantMetadata = {
            link: meta.link,
            linkTags: meta.linkTags,
            ipAddress: meta.ipAddress,
            userAgent: meta.userAgent,
          }
          break
        case 'BOUNCE':
          importantMetadata = {
            bounceType: meta.bounceType,
            bounceSubType: meta.bounceSubType,
            diagnosticCode: meta.bouncedRecipients[0].diagnosticCode,
          }
          break
        case 'COMPLAINT':
          importantMetadata = {
            userAgent: meta.userAgent,
            complaintFeedbackType: meta.complaintFeedbackType,
          }
          break
        default:
          importantMetadata = {}
          break
      }

      const result = await this.registerEvent.execute({
        contactId: data.mail.tags.contactId[0],
        messageId: data.mail.tags.messageId[0],
        event: { type, meta: importantMetadata },
      })

      if (result.isLeft()) {
        const error = result.value

        return clientError(error)
      } else {
        return ok()
      }
    } catch (err) {
      return fail(err)
    }
  }
}
