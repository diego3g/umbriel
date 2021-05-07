import { IMailProvider, MailMessage } from '../../models/IMailProvider'

export class MailLogProvider implements IMailProvider {
  async sendEmail(message: MailMessage): Promise<void> {
    console.log(`Sent message "${message.subject}" to ${message.to.email}`)
  }
}
