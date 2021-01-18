import { Queue, Worker, Processor, QueueScheduler } from 'bullmq'
import Redis, { Redis as RedisConnection } from 'ioredis'
import { IQueueService } from '../../../domain/services/IQueueService'

export class BullProvider implements IQueueService {
  private redisConnection: RedisConnection
  private queue: Queue

  constructor() {
    this.redisConnection = new Redis()
    this.queue = new Queue('mail-queue', {
      connection: this.redisConnection,
      defaultJobOptions: {
        removeOnComplete: true,
        attempts: 5,
        backoff: {
          type: 'exponential',
          delay: 5000,
        },
      },
    })
  }

  async addManyJobs(jobs: object[]): Promise<void> {
    const parsedJobs = jobs.map(jobData => {
      return { name: 'message', data: jobData }
    })

    await this.queue.addBulk(parsedJobs)
  }

  async addJob(job: object): Promise<void> {
    await this.queue.add('message', job)
  }

  process(processFunction: Processor<object>): void {
    new Worker('mail-queue', processFunction, {
      connection: this.redisConnection,
      concurrency: 150,
      limiter: {
        max: 150,
        duration: 1000,
      },
    })

    new QueueScheduler('mail-queue', {
      connection: this.redisConnection,
    })
  }
}
