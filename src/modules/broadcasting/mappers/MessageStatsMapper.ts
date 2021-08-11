import { MessageStats } from '../dtos/MessageStats'

export type MessageStatsRaw = {
  RECIPIENT: number
  DELIVER: number
  OPEN: number
  CLICK: number
}

export class MessageStatsMapper {
  static toDto(raw: MessageStatsRaw): MessageStats {
    return {
      recipientsCount: raw.RECIPIENT,
      deliverCount: raw.DELIVER,
      clickCount: raw.CLICK,
      openRate: Number(((raw.OPEN * 100) / raw.DELIVER).toFixed(2)),
      clickRate: Number(((raw.CLICK * 100) / raw.OPEN).toFixed(2)),
    }
  }
}
