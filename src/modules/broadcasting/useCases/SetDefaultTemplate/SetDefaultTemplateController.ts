import { Controller } from '@core/infra/Controller'
import { HttpResponse, fail, ok, clientError } from '@core/infra/HttpResponse'

import { SetDefaultTemplate } from './SetDefaultTemplate'

type SetDefaultTemplateControllerRequest = {
  templateId: string
}

export class SetDefaultTemplateController implements Controller {
  constructor(private setDefaultTemplate: SetDefaultTemplate) {}

  async handle({
    templateId,
  }: SetDefaultTemplateControllerRequest): Promise<HttpResponse> {
    try {
      const result = await this.setDefaultTemplate.execute({
        templateId,
      })

      if (result.isLeft()) {
        const error = result.value

        switch (error.constructor) {
          default:
            return clientError(error)
        }
      } else {
        return ok()
      }
    } catch (err) {
      return fail(err)
    }
  }
}
