import { Either, left, right } from '../../../core/logic/Either';
import { InvalidNameError } from './errors/InvalidNameError';

export class Name {
  private readonly name: string;

  private constructor(name: string) {
    this.name = name;

    Object.freeze(this);
  }

  static validate(name: string): boolean {
    if (!name || name.trim().length < 2 || name.trim().length > 255) {
      return false;
    }

    return true;
  }

  static create(name: string): Either<InvalidNameError, Name> {
    if (!this.validate(name)) {
      return left(new InvalidNameError(name));
    }

    return right(new Name(name));
  }
}
