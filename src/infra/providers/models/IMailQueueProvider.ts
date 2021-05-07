import { IDeliverMessageJob } from '@modules/broadcasting/jobs/IDeliverMessageJob'

export interface Job {
  data: IDeliverMessageJob
}

export interface IMailQueueProvider {
  addJob(job: IDeliverMessageJob): Promise<void>
  addManyJobs(jobs: IDeliverMessageJob[]): Promise<void>
  process(processFunction: (job: Job) => Promise<void>): void
}
