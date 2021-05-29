import { Either, left, right } from '@core/logic/Either'
import { Email } from '@modules/senders/domain/sender/email'
import { InvalidEmailError } from '@modules/senders/domain/sender/errors/InvalidEmailError'
import { InvalidNameError } from '@modules/senders/domain/sender/errors/InvalidNameError'
import { Name } from '@modules/senders/domain/sender/name'
import { Sender } from '@modules/senders/domain/sender/sender'
import { ISendersRepository } from '@modules/senders/repositories/ISendersRepository'

type CreateSenderRequest = {
  name: string
  email: string
}

type CreateSenderResponse = Either<InvalidNameError | InvalidEmailError, Sender>

export class CreateSender {
  constructor(private sendersRepository: ISendersRepository) {}

  async execute({
    name,
    email,
  }: CreateSenderRequest): Promise<CreateSenderResponse> {
    const nameOrError = Name.create(name)
    const emailOrError = Email.create(email)

    if (nameOrError.isLeft()) {
      return left(nameOrError.value)
    }

    if (emailOrError.isLeft()) {
      return left(emailOrError.value)
    }

    const contactOrError = Sender.create({
      name: nameOrError.value,
      email: emailOrError.value,
    })

    if (contactOrError.isLeft()) {
      return left(contactOrError.value)
    }

    const contact = contactOrError.value

    await this.sendersRepository.create(contact)

    return right(contact)
  }
}
