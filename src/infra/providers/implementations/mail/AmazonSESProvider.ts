import SES, { SendEmailRequest } from 'aws-sdk/clients/ses'
import { htmlToText } from 'html-to-text'

import { IMailProvider, MailMessage } from '../../models/IMailProvider'

export class SESProvider implements IMailProvider {
  private client: SES

  constructor() {
    this.client = new SES({
      region: 'us-east-1',
    })
  }

  async sendEmail(
    message: MailMessage,
    meta?: Record<string, string>
  ): Promise<void> {
    const sendMailConfig = {
      Source: `${message.from.name} <${message.from.email}>`,
      Destination: {
        ToAddresses: [
          message.to.name
            ? `${message.to.name} <${message.to.email}>`
            : message.to.email,
        ],
      },
      Message: {
        Subject: {
          Data: message.subject,
        },
        Body: {
          Html: {
            Data: message.body,
          },
          Text: {
            Data: htmlToText(message.body, {
              ignoreImage: true,
              preserveNewlines: true,
              wordwrap: 120,
            }),
          },
        },
      },
    } as SendEmailRequest

    if (meta) {
      sendMailConfig.ConfigurationSetName = 'Umbriel'

      sendMailConfig.Tags = Object.keys(meta).map(key => {
        return {
          Name: key,
          Value: meta[key],
        }
      })
    }

    await this.client.sendEmail(sendMailConfig).promise()
  }
}
