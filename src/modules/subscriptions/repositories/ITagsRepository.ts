import { Tag } from '../domain/tag/tag'

export interface ITagsRepository {
  exists(title: string): Promise<boolean>
  findById(id: string): Promise<Tag>
  findManyByIds(ids: string[]): Promise<Tag[]>
  findByTitle(title: string): Promise<Tag>
  save(tag: Tag): Promise<void>
  create(tag: Tag): Promise<void>
}
