import SES from 'aws-sdk/clients/ses'
import { htmlToText } from 'html-to-text'
import { IMailProvider, MailMessage } from '../../models/IMailProvider'

export class SESProvider implements IMailProvider {
  private client: SES

  constructor() {
    this.client = new SES({
      region: 'us-east-1',
    })
  }

  async sendEmail(message: MailMessage): Promise<void> {
    await this.client
      .sendEmail({
        Source: `${message.from.name} <${message.from.email}>`,
        Destination: {
          ToAddresses: [`${message.to.name} <${message.to.email}>`],
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
        // Tags: [
        //   {
        //     Name: 'identificator',
        //     Value: message.to.replace('@', '').replace(/\./g, ''),
        //   },
        // ],
        ConfigurationSetName: 'Umbriel',
      })
      .promise()
  }
}
