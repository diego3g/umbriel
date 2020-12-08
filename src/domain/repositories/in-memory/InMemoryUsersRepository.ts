import { User } from '../../models/user/user';
import { IUsersRepository } from '../IUsersRepository';

export class InMemoryUsersRepository implements IUsersRepository {
  private users: User[];

  constructor(users: User[] = []) {
    this.users = users;
  }

  async exists(email: string): Promise<boolean> {
    return this.users.some(user => user.email.value === email);
  }

  async save(user: User): Promise<void> {
    this.users.push(user);
  }
}
