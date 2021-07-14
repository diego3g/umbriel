import { IDeliverMessageJob } from '@modules/broadcasting/jobs/IDeliverMessageJob'

import { IMailQueueProvider, Job } from '../../models/IMailQueueProvider'

export class SyncQueueProvider implements IMailQueueProvider {
  public jobs: IDeliverMessageJob[] = []

  async addManyJobs(jobs: IDeliverMessageJob[]): Promise<void> {
    this.jobs.push(...jobs)
  }

  async addJob(job: IDeliverMessageJob): Promise<void> {
    this.jobs.push(job)
  }

  process(processFunction: (job: Job) => Promise<void>): void {
    this.jobs.forEach((job, index) => {
      processFunction({ data: job })
      this.jobs.splice(index, 1)
    })
  }
}
