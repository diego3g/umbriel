interface Job {
  data: object
}

export default interface IQueueService {
  addJob(data: object): Promise<void>
  process(processFunction: (job: Job) => Promise<void>): void
}
