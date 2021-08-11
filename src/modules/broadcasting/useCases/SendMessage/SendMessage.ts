import inlineCss from 'inline-css'

import { Either, left, right } from '@core/logic/Either'
import { IMailQueueProvider } from '@infra/providers/models/IMailQueueProvider'
import { IMessageTagsRepository } from '@modules/broadcasting/repositories/IMessageTagsRepository'
import { ISendersRepository } from '@modules/senders/repositories/ISendersRepository'

import { IContactsRepository } from '../../../subscriptions/repositories/IContactsRepository'
import { Body } from '../../domain/message/body'
import { Message } from '../../domain/message/message'
import { IMessagesRepository } from '../../repositories/IMessagesRepository'
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
    private sendersRepository: ISendersRepository,
    private mailQueueProvider: IMailQueueProvider
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

      const messageBodyContent = template.content.compose(message.body.value)
      const messageBodyWithInlineCSS = await inlineCss(messageBodyContent, {
        url: 'not-required',
        removeHtmlSelectors: true,
      })

      messageBody = Body.create(messageBodyWithInlineCSS).value as Body
    }

    const messageTags = await this.messageTagsRepository.findManyByMessageId(
      message.id
    )

    const tagsIds = messageTags.map(messageTag => messageTag.tagId)
    const contacts = await this.contactsRepository.findSubscribedByTags(tagsIds)

    const sender = await this.sendersRepository.findById(message.senderId)

    message.deliver(contacts.length, messageBody)

    const queueJobs = contacts.map(contact => {
      return {
        sender: {
          name: sender.name.value,
          email: sender.email.value,
        },
        recipient: {
          id: contact.id,
          name: contact.name.value,
          email: contact.email.value,
        },
        message: {
          id: message.id,
          subject: message.subject.value,
          body: message.body.value,
        },
      }
    })

    await this.mailQueueProvider.addManyJobs(queueJobs)

    await this.messagesRepository.save(message)

    return right(message)
  }
}
