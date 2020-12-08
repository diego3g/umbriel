import { User } from './user';

describe('User password value object', () => {
  it('should be able to create new user', () => {
    const userOrError = User.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    expect(userOrError.isRight()).toBeTruthy();
  });

  it('should not be able to create new user with invalid name', () => {
    const userOrError = User.create({
      name: 'J',
      email: 'johndoe@example.com',
      password: '123456',
    });

    expect(userOrError.isLeft()).toBeTruthy();
  });

  it('should not be able to create new user with invalid email', () => {
    const userOrError = User.create({
      name: 'John Doe',
      email: 'johndoe.com',
      password: '123456',
    });

    expect(userOrError.isLeft()).toBeTruthy();
  });

  it('should not be able to create new user with invalid password', () => {
    const userOrError = User.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123',
    });

    expect(userOrError.isLeft()).toBeTruthy();
  });
});
