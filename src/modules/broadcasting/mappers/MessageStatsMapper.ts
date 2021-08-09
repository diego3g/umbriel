import { MessageStats } from '../dtos/MessageStats'

export type MessageStatsRaw = {
  OPEN: number
  CLICK: number
  DELIVER: number
}

export class MessageStatsMapper {
  static toDto(raw: MessageStatsRaw): MessageStats {
    return {
      recipientsCount: raw.DELIVER,
      clickCount: raw.CLICK,
      openRate: Number(((raw.OPEN * 100) / raw.DELIVER).toFixed(2)),
      clickRate: Number(((raw.CLICK * 100) / raw.OPEN).toFixed(2)),
    }
  }
}
