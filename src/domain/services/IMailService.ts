interface Message {
  from: {
    name: string
    email: string
  }
  to: string
  subject: string
  body: string
}

export default interface IMailService {
  sendEmail(message: Message): Promise<void>
}
