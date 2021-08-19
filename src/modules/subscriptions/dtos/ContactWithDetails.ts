export type ContactWithDetails = {
  id: string
  name: string
  email: string
  is_unsubscribed: boolean
  is_blocked: boolean
  subscriptions: Array<{
    id: string
    tag: {
      id: string
      title: string
    }
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
