export type MessageWithDetails = {
  id: string
  subject: string
  body: string
  sentAt: Date
  sender: {
    name: string
    email: string
  }
  tags: Array<{
    id: string
    title: string
  }>
}
