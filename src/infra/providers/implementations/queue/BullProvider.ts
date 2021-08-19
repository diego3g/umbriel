import { Queue, Worker, Processor, QueueScheduler } from 'bullmq'

import { redisConnection } from '@infra/redis/connection'
import { IDeliverMessageJob } from '@modules/broadcasting/jobs/IDeliverMessageJob'

import { IMailQueueProvider } from '../../models/IMailQueueProvider'

export class BullProvider implements IMailQueueProvider {
  private queue: Queue

  constructor() {
    this.queue = new Queue('mail-queue', {
      connection: redisConnection,
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

  async addManyJobs(jobs: IDeliverMessageJob[]): Promise<void> {
    const parsedJobs = jobs.map(jobData => {
      return { name: 'message', data: jobData }
    })

    await this.queue.addBulk(parsedJobs)
  }

  async addJob(job: IDeliverMessageJob): Promise<void> {
    await this.queue.add('message', job)
  }

  process(processFunction: Processor<IDeliverMessageJob>): void {
    new Worker('mail-queue', processFunction, {
      connection: redisConnection,
      concurrency: 100,
      limiter: {
        max: 400,
        duration: 1000,
      },
    })

    new QueueScheduler('mail-queue', {
      connection: redisConnection,
    })
  }
}
