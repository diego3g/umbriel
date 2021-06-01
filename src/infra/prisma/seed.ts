import { v4 } from 'uuid'

import { prisma } from './client'

async function main() {
  const tag1 = await prisma.tag.create({
    data: {
      id: v4(),
      title: 'Tag 01',
    },
  })

  const tag2 = await prisma.tag.create({
    data: {
      id: v4(),
      title: 'Tag 02',
    },
  })

  await prisma.contact.create({
    data: {
      id: v4(),
      name: 'John Doe',
      email: 'johndoe@example.com',
      subscriptions: {
        connect: [
          {
            id: tag1.id,
          },
          {
            id: tag2.id,
          },
        ],
      },
    },
  })

  await prisma.contact.create({
    data: {
      id: v4(),
      name: 'John Tag 01',
      email: 'johntag01@example.com',
      subscriptions: {
        connect: [
          {
            id: tag1.id,
          },
        ],
      },
    },
  })
}

main()
