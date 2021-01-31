import { BullProvider } from '@infra/providers/implementations/queue/BullProvider'

const bullProvider = new BullProvider()

bullProvider.process(async data => {
  console.log(data)
})
