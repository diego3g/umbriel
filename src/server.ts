import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // await prisma.user.create({
  //   data: {
  //     name: 'Diego Fernandes',
  //     email: 'diego@rocketseat.team',
  //     password: '123456',
  //   }
  // })

  const users = await prisma.user.findMany()

  console.log(users);
}

main();