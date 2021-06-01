import { MailLogProvider } from '@infra/providers/implementations/mail/MailLogProvider'
import { IMailProvider } from '@infra/providers/models/IMailProvider'

import { DeliverMessageToRecipient } from './DeliverMessageToRecipient'

let mailProvider: IMailProvider
let deliverMessageToRecipient: DeliverMessageToRecipient

const sendEmailMock = jest.fn()

jest.mock('@infra/providers/implementations/mail/MailLogProvider', () => {
  return {
    MailLogProvider: jest.fn().mockImplementation(() => {
      return {
        sendEmail: sendEmailMock,
      }
    }),
  }
})

describe('Send Message', () => {
  beforeEach(() => {
    mailProvider = new MailLogProvider()

    deliverMessageToRecipient = new DeliverMessageToRecipient(mailProvider)
  })

  it('should be able to deliver message to recipient', async () => {
    // const mockedMailProvider = mocked(MailLogProvider, true)

    await deliverMessageToRecipient.execute({
      message: {
        id: 'fake-message-id',
        subject: 'Message subject',
        body: 'Message body',
      },
      sender: {
        name: 'John Doe Sender',
        email: 'johnsender@example.com',
      },
      recipient: {
        id: 'fake-recipient-id',
        name: 'John Doe',
        email: 'johndoe@example.com',
      },
    })

    expect(sendEmailMock).toHaveBeenCalled()
  })
})
