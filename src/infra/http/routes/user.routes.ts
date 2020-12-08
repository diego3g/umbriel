import express from 'express';
import { InMemoryUsersRepository } from '../../../domain/repositories/in-memory/InMemoryUsersRepository';
import { RegisterUser } from '../../../domain/usecases/RegisterUser/RegisterUser';
import { RegisterUserController } from '../controllers/RegisterUserController';

const userRouter = express.Router();

const inMemoryUsersRepository = new InMemoryUsersRepository();
const registerUser = new RegisterUser(inMemoryUsersRepository);
const registerUserController = new RegisterUserController(registerUser);

userRouter.post('/', registerUserController.execute);

export default userRouter;
