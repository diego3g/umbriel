import { IMailProvider, MailMessage } from '../../models/IMailProvider'

export class MailLogProvider implements IMailProvider {
  async sendEmail(
    message: MailMessage,
    meta?: Record<string, unknown>
  ): Promise<void> {
    console.log({
      message: message.subject,
      recipient: message.to.email,
      meta,
    })
  }
}
