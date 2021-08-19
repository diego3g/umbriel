export type MessageWithDetails = {
  id: string
  subject: string
  body: string
  sentAt: Date
  sender: {
    name: string
    email: string
  }
  template: {
    title: string
    content: string
  }
  tags: Array<{
    id: string
    title: string
  }>
}
