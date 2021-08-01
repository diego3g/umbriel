import Redis, { RedisOptions } from 'ioredis'

const options: RedisOptions = {
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT ?? 6379),
  db: Number(process.env.REDIS_DB ?? 0),
}

if (process.env.REDIS_PASS) {
  options.password = process.env.REDIS_PASS
}

export const redisConnection = new Redis(options)
