import { Either, left, right } from '@core/logic/Either'
import { IQueueProvider } from '@infra/providers/models/IQueueProvider'
import { IMessageTagsRepository } from '@modules/broadcasting/repositories/IMessageTagsRepository'

import { IContactsRepository } from '../../../subscriptions/repositories/IContactsRepository'
import { Body } from '../../domain/message/body'
import { Message } from '../../domain/message/message'
import { Recipient } from '../../domain/recipient/recipient'
import { IMessagesRepository } from '../../repositories/IMessagesRepository'
import { IRecipientsRepository } from '../../repositories/IRecipientsRepository'
import { ITemplatesRepository } from '../../repositories/ITemplatesRepository'
import { InvalidMessageError } from './errors/InvalidMessageError'
import { InvalidTemplateError } from './errors/InvalidTemplateError'
import { MessageAlreadySentError } from './errors/MessageAlreadySentError'

type SendMessageResponse = Either<
  InvalidMessageError | InvalidTemplateError,
  Message
>

export class SendMessage {
  constructor(
    private messagesRepository: IMessagesRepository,
    private messageTagsRepository: IMessageTagsRepository,
    private templatesRepository: ITemplatesRepository,
    private contactsRepository: IContactsRepository,
    private queueProvider: IQueueProvider
  ) {}

  async execute(messageId: string): Promise<SendMessageResponse> {
    const message = await this.messagesRepository.findById(messageId)

    if (!message) {
      return left(new InvalidMessageError())
    }

    if (message.sentAt) {
      return left(new MessageAlreadySentError())
    }

    let messageBody = message.body

    if (message.templateId) {
      const template = await this.templatesRepository.findById(
        message.templateId
      )

      if (!template) {
        return left(new InvalidTemplateError())
      }

      const messageBodyContent = template.content.value.replace(
        '{{ message_content }}',
        message.body.value
      )

      messageBody = Body.create(messageBodyContent).value as Body
    }

    const messageTags = await this.messageTagsRepository.findManyByMessageId(
      message.id
    )

    const tagsIds = messageTags.map(messageTag => messageTag.tagId)
    const contacts = await this.contactsRepository.findByTagsIds(tagsIds)

    const queueJobs = contacts.map(contact => {
      return {
        contactId: contact.id,
        messageId: message.id,
      }
    })

    await this.queueProvider.addManyJobs(queueJobs)

    // await this.recipientsRepository.createMany(recipients)

    message.deliver([], messageBody)

    await this.messagesRepository.save(message)

    return right(message)
  }
}
