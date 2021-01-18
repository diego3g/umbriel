import { User } from '../../domain/user/user'
import { IUsersRepository } from '../IUsersRepository'

export class InMemoryUsersRepository implements IUsersRepository {
  constructor(public items: User[] = []) {}

  async exists(email: string): Promise<boolean> {
    return this.items.some(user => user.email.value === email)
  }

  async findByEmail(email: string): Promise<User> {
    return this.items.find(user => user.email.value === email)
  }

  async save(user: User): Promise<void> {
    const userIndex = this.items.findIndex(findUser => findUser.id === user.id)

    this.items[userIndex] = user
  }

  async create(user: User): Promise<void> {
    this.items.push(user)
  }
}
