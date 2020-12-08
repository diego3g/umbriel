import { Name } from './name';
import { Email } from './email';
import { Password } from './password';
import { InvalidNameError } from './errors/InvalidNameError';
import { InvalidEmailError } from './errors/InvalidEmailError';
import { InvalidPasswordError } from './errors/InvalidPasswordError';
import { Either, left, right } from '../../../core/logic/Either';

export interface IUserData {
  name: string;
  email: string;
  password: string;
}

export class User {
  public readonly name: Name;
  public readonly email: Email;
  public readonly password: Password;

  private constructor(name: Name, email: Email, password: Password) {
    this.name = name;
    this.email = email;
    this.password = password;

    Object.freeze(this);
  }

  static create(
    userData: IUserData
  ): Either<InvalidNameError | InvalidEmailError | InvalidPasswordError, User> {
    const nameOrError = Name.create(userData.name);
    const emailOrError = Email.create(userData.email);
    const passwordOrError = Password.create(userData.password);

    if (nameOrError.isLeft()) {
      return left(nameOrError.value);
    }

    if (emailOrError.isLeft()) {
      return left(emailOrError.value);
    }

    if (passwordOrError.isLeft()) {
      return left(passwordOrError.value);
    }

    const user = new User(
      nameOrError.value,
      emailOrError.value,
      passwordOrError.value
    );

    return right(user);
  }
}
