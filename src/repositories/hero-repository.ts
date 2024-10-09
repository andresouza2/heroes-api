import { Hero } from '@prisma/client'
import { CreateHeroDto } from 'src/modules/hero/dto/create-hero.dto'

export abstract class HeroRepository {
  abstract create(body: CreateHeroDto, file: Express.Multer.File): Promise<Hero & { imageUrl: string }>
  abstract findAll(): Promise<Hero[]>
  abstract findById(id: string): Promise<Hero>
  abstract deleteById(id: string): Promise<void>
  abstract updateById(
    id: string,
    body: { name?: string; description?: string; image?: string },
    file: Express.Multer.File,
  ): Promise<Hero & { imageUrl: string }>
}
