import { User } from '../models/user/user'

export interface IUsersRepository {
  items: User[]
  exists(email: string): Promise<boolean>
  findByEmail(email: string): Promise<User>
  save(user: User): Promise<void>
}
