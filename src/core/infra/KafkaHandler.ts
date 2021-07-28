export interface KafkaHandler<T = any> {
  handle: (message: T) => Promise<void>
}
