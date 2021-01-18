interface Job {
  data: object
}

export interface IQueueService {
  addJob(data: object): Promise<void>
  process(processFunction: (job: Job) => Promise<void>): void
}
