import { prisma } from '@infra/prisma/client'

import { User } from '../../domain/user/user'
import { UserMapper } from '../../mappers/UserMapper'
import { IUsersRepository } from '../IUsersRepository'

export class PrismaUsersRepository implements IUsersRepository {
  async exists(email: string): Promise<boolean> {
    const userExists = await prisma.user.findUnique({
      where: { email },
    })

    return !!userExists
  }

  async findByEmail(email: string): Promise<User> {
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return null
    }

    return UserMapper.toDomain(user)
  }

  async save(user: User): Promise<void> {
    const data = await UserMapper.toPersistence(user)

    await prisma.message.update({
      where: {
        id: user.id,
      },
      data,
    })
  }

  async create(user: User): Promise<void> {
    const data = await UserMapper.toPersistence(user)

    await prisma.user.create({ data })
  }
}
