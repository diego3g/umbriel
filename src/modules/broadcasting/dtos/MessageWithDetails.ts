export type MessageWithDetails = {
  id: string
  subject: string
  body: string
  sender: {
    name: string
    email: string
  }
  tags: Array<{
    id: string
    title: string
  }>
}
