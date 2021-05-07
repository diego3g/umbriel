import Redis from 'ioredis'

export const redisConnection = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT ?? 6379),
  db: Number(process.env.REDIS_DB ?? 0),
})
