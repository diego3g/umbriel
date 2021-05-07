export interface IDeliverMessageJob {
  recipient: {
    name: string
    email: string
  }
  sender: {
    name: string
    email: string
  }
  message: {
    subject: string
    body: string
  }
}
