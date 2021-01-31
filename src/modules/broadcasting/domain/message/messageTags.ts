import { WatchedList } from '@core/domain/WatchedList'

import { MessageTag } from './messageTag'

export class MessageTags extends WatchedList<MessageTag> {
  private constructor(tags: MessageTag[]) {
    super(tags)
  }

  public compareItems(a: MessageTag, b: MessageTag): boolean {
    return a.equals(b)
  }

  public static create(tags?: MessageTag[]): MessageTags {
    return new MessageTags(tags || [])
  }
}
