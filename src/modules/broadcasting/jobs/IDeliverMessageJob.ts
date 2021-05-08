export interface IDeliverMessageJob {
  sender: {
    name: string
    email: string
  }
  recipient: {
    id: string
    name: string
    email: string
  }
  message: {
    id: string
    subject: string
    body: string
  }
}
