import { Either, left, right } from '@core/logic/Either'
import { ITemplatesRepository } from '@modules/broadcasting/repositories/ITemplatesRepository'

import { InvalidTemplateError } from './errors/InvalidTemplateError'

type SetDefaultTemplateRequest = {
  templateId: string
}

type SetDefaultTemplateResponse = Either<InvalidTemplateError, null>

export class SetDefaultTemplate {
  constructor(private templatesRepository: ITemplatesRepository) {}

  async execute({
    templateId,
  }: SetDefaultTemplateRequest): Promise<SetDefaultTemplateResponse> {
    const template = await this.templatesRepository.findById(templateId)

    if (!template) {
      return left(new InvalidTemplateError())
    }

    const currentDefaultTemplate =
      await this.templatesRepository.findDefaultTemplate()

    if (currentDefaultTemplate) {
      currentDefaultTemplate.unsetAsDefault()

      await this.templatesRepository.save(currentDefaultTemplate)
    }

    template.setAsDefault()

    await this.templatesRepository.save(template)

    return right(null)
  }
}
