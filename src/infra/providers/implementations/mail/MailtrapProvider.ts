import nodemailer, { Transporter } from 'nodemailer'

import { IMailProvider, MailMessage } from '../../models/IMailProvider'

export class MailtrapProvider implements IMailProvider {
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
