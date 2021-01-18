import { Either, left, right } from '../../../../core/logic/Either'
import { Body } from '../../domain/message/body'
import { Message } from '../../domain/message/message'
import { Recipient } from '../../domain/message/recipient'
import { IContactsRepository } from '../../../subscriptions/repositories/IContactsRepository'
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
    private templatesRepository: ITemplatesRepository,
    private contactsRepository: IContactsRepository,
    private recipientsRepository: IRecipientsRepository
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

    const tagsIds = message.tags.map(tag => tag.id)
    const contacts = await this.contactsRepository.findByTagsIds(tagsIds)

    const recipients = contacts.map(contact => {
      const recipient = Recipient.create({
        contactId: contact.id,
        messageId: message.id,
      })

      return recipient
    })

    await this.recipientsRepository.createMany(recipients)

    message.deliver(recipients, messageBody)

    await this.messagesRepository.save(message)

    return right(message)
  }
}
