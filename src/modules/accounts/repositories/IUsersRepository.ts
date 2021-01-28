import { User } from '../domain/user/user'

export interface IUsersRepository {
  exists(email: string): Promise<boolean>
  findByEmail(email: string): Promise<User>
  save(user: User): Promise<void>
  create(user: User): Promise<void>
}
