import { Either, left, right } from '../../../core/logic/Either';
import { InvalidEmailError } from '../../models/user/errors/InvalidEmailError';
import { InvalidNameError } from '../../models/user/errors/InvalidNameError';
import { InvalidPasswordError } from '../../models/user/errors/InvalidPasswordError';
import { IUserData, User } from '../../models/user/user';
import { IUsersRepository } from '../../repositories/IUsersRepository';
import { AccountAlreadyExistsError } from './errors/AccountAlreadyExistsError';

type RegisterUserResponse = Either<
  | AccountAlreadyExistsError
  | InvalidNameError
  | InvalidEmailError
  | InvalidPasswordError,
  User
>;

export class RegisterUser {
  private usersRepository: IUsersRepository;

  constructor(usersRepository: IUsersRepository) {
    this.usersRepository = usersRepository;
  }

  async execute(userData: IUserData): Promise<RegisterUserResponse> {
    const userOrError = User.create(userData);

    if (userOrError.isLeft()) {
      return left(userOrError.value);
    }

    const user = userOrError.value;

    const userAlreadyExists = await this.usersRepository.exists(
      user.email.value
    );

    if (userAlreadyExists) {
      return left(new AccountAlreadyExistsError(user.email.value));
    }

    await this.usersRepository.save(user);

    return right(user);
  }
}
