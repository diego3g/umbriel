import { Tag } from '../models/tag/tag'

export interface ITagsRepository {
  items: Tag[]
  exists(title: string): Promise<boolean>
  findById(id: string): Promise<Tag>
  findByTitle(title: string): Promise<Tag>
  save(tag: Tag): Promise<void>
  create(tag: Tag): Promise<void>
}
