import { Either, left, right } from '@core/logic/Either'

import { InvalidContentError } from './errors/InvalidContentError'

export class Content {
  private readonly content: string

  get value(): string {
    return this.content
  }

  public compose(messageContent: string) {
    return this.value.replace('{{ message_content }}', messageContent)
  }

  private constructor(content: string) {
    this.content = content
  }

  static validate(content: string): boolean {
    if (!content || !content.includes('{{ message_content }}')) {
      return false
    }

    return true
  }

  static create(content: string): Either<InvalidContentError, Content> {
    if (!this.validate(content)) {
      return left(new InvalidContentError())
    }

    return right(new Content(content))
  }
}
