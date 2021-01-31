interface Job {
  data: object
}

export interface IQueueProvider {
  addJob(job: object): Promise<void>
  addManyJobs(jobs: object[]): Promise<void>
  process(processFunction: (job: Job) => Promise<void>): void
}
