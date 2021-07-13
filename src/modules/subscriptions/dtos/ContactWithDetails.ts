export type ContactWithDetails = {
  id: string
  name: string
  email: string
  subscriptions: Array<{
    id: string
    tag: string
  }>
  messages: Array<{
    id: string
    subject: string
    sentAt: Date
    events: Array<{
      id: string
      type: string
      createdAt: Date
    }>
  }>
}
