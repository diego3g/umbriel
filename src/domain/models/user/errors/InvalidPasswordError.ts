import { DomainError } from './DomainError';

export class InvalidPasswordError extends Error implements DomainError {
  constructor() {
    super(`The password is invalid.`);
    this.name = 'InvalidPasswordError';
  }
}
