import { Hero } from '@prisma/client'

export abstract class HeroRepository {
  abstract create(body: { id?: string; name: string; description: string; image?: string }): Promise<Hero>
  abstract findAll(): Promise<Hero[]>
  abstract findById(id: string): Promise<Hero>
  abstract deleteById(id: string): Promise<void>
  abstract updateById(id: string, body: { name?: string; description?: string; image?: string }): Promise<Hero>
}
