import { Controller } from '@core/infra/Controller'
import { PreviewTemplate } from '@modules/broadcasting/useCases/PreviewTemplate/PreviewTemplate'
import { PreviewTemplateController } from '@modules/broadcasting/useCases/PreviewTemplate/PreviewTemplateController'

export function makePreviewTemplateController(): Controller {
  const previewTemplate = new PreviewTemplate()
  const previewTemplateController = new PreviewTemplateController(
    previewTemplate
  )

  return previewTemplateController
}
