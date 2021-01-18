import nodemailer, { Transporter } from 'nodemailer'
import {
  IMailService,
  MailMessage,
} from '../../../domain/services/IMailService'

export class MailtrapProvider implements IMailService {
  private transporter: Transporter

  constructor(mailConfig: object) {
    this.transporter = nodemailer.createTransport(mailConfig)
  }

  async sendEmail(message: MailMessage): Promise<void> {
    await this.transporter.sendMail({
      from: {
        name: message.from.name,
        address: message.from.email,
      },
      to: {
        name: message.to.name,
        address: message.to.email,
      },
      subject: message.subject,
      html: message.body,
    })
  }
}
