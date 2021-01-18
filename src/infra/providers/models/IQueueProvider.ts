interface Job {
  data: object
}

export interface IQueueProvider {
  addJob(data: object): Promise<void>
  process(processFunction: (job: Job) => Promise<void>): void
}
