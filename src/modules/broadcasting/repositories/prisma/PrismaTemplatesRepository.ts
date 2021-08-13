import { prisma } from '@infra/prisma/client'
import { TemplateMapper } from '@modules/broadcasting/mappers/TemplateMapper'

import { Template } from '../../domain/template/template'
import {
  ITemplatesRepository,
  TemplatesSearchParams,
  TemplatesSearchResult,
} from '../ITemplatesRepository'

export class PrismaTemplatesRepository implements ITemplatesRepository {
  async findAll(): Promise<Template[]> {
    const templates = await prisma.template.findMany()

    return templates.map(template => TemplateMapper.toDomain(template))
  }

  async findById(id: string): Promise<Template> {
    const template = await prisma.template.findUnique({ where: { id } })

    return TemplateMapper.toDomain(template)
  }

  async findDefaultTemplate(): Promise<Template> {
    const template = await prisma.template.findFirst({
      where: { is_default: true },
    })

    return template ? TemplateMapper.toDomain(template) : null
  }

  async save(template: Template): Promise<void> {
    const data = TemplateMapper.toPersistence(template)

    await prisma.template.update({
      where: {
        id: template.id,
      },
      data,
    })
  }

  async create(template: Template): Promise<void> {
    const data = TemplateMapper.toPersistence(template)

    await prisma.template.create({ data })
  }

  async search({
    query,
    page,
    perPage,
  }: TemplatesSearchParams): Promise<TemplatesSearchResult> {
    const queryPayload = {
      take: perPage,
      skip: (page - 1) * perPage,
      where: {},
    }

    if (query) {
      queryPayload.where = {
        title: { contains: query, mode: 'insensitive' },
      }
    }

    const templates = await prisma.template.findMany({
      ...queryPayload,
      orderBy: {
        title: 'asc',
      },
    })

    const estimatedCount = await prisma.template.aggregate({
      _count: true,
      where: queryPayload.where,
    })

    return {
      data: templates.map(template => TemplateMapper.toDomain(template)),
      totalCount: estimatedCount._count,
    }
  }
}
