import { Entity } from '@core/domain/Entity'

interface IMessageTagProps {
  messageId: string
  tagId: string
}

export class MessageTag extends Entity<IMessageTagProps> {
  get messageId() {
    return this.props.messageId
  }

  get tagId() {
    return this.props.tagId
  }

  private constructor(props: IMessageTagProps, id?: string) {
    super(props, id)
  }

  static create(props: IMessageTagProps, id?: string): MessageTag {
    const messageTag = new MessageTag(props, id)

    return messageTag
  }
}
