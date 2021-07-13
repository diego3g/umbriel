import { Template as PersistenceTemplate } from '@prisma/client'

import { Content } from '../domain/template/content'
import { Template } from '../domain/template/template'
import { Title } from '../domain/template/title'

export class TemplateMapper {
  static toDomain(raw: PersistenceTemplate): Template {
    const titleOrError = Title.create(raw.title)
    const contentOrError = Content.create(raw.content)

    if (titleOrError.isLeft()) {
      throw new Error('Title value is invalid.')
    }

    if (contentOrError.isLeft()) {
      throw new Error('Content value is invalid.')
    }

    const messageOrError = Template.create(
      {
        title: titleOrError.value,
        content: contentOrError.value,
        isDefault: raw.is_default,
      },
      raw.id
    )

    if (messageOrError.isRight()) {
      return messageOrError.value
    }

    return null
  }

  static toPersistence(template: Template) {
    return {
      id: template.id,
      title: template.title.value,
      content: template.content.value,
      is_default: template.isDefault,
    }
  }
}
