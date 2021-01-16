import { User } from '../models/user/user'

export interface IUsersRepository {
  exists(email: string): Promise<boolean>
  save(user: User): Promise<void>
}
