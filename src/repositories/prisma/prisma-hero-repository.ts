import { Hero } from '@prisma/client'
import { HeroRepository } from '../hero-repository'
import { PrismaService } from 'src/database/prisma.service'
import { randomUUID } from 'node:crypto'
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'

interface CreateHeroParams {
  name: string
  description: string
  image?: string
}

@Injectable()
export class PrismaHeroRepository implements HeroRepository {
  constructor(private prisma: PrismaService) {}

  async create(body: CreateHeroParams): Promise<Hero> {
    const { name, description, image } = body

    try {
      const hero = await this.prisma.hero.create({
        data: {
          id: randomUUID(),
          name,
          description,
          image,
        },
      })
      return hero
    } catch (error) {
      throw new BadRequestException('Erro ao cadastrar um herói ' + error)
    }
  }

  async findAll(): Promise<Hero[]> {
    try {
      const heroes = await this.prisma.hero.findMany()

      return heroes
    } catch (error) {
      throw new Error('Error finding heroes ' + error)
    }
  }

  async findById(id: string) {
    const hero = await this.prisma.hero.findUnique({
      where: {
        id,
      },
    })

    if (!hero) throw new NotFoundException('Hero not found')

    return hero
  }

  async deleteById(id: string) {
    const hero = await this.prisma.hero.findUnique({
      where: {
        id,
      },
    })

    if (!hero) throw new NotFoundException('Hero not found')

    await this.prisma.hero.delete({
      where: {
        id,
      },
    })
  }

  async updateById(id: string, body: { name?: string; description?: string; image?: string }) {
    const { name, description, image } = body

    const hero = await this.prisma.hero.findUnique({
      where: {
        id,
      },
    })

    if (!hero) throw new NotFoundException('Hero not found')

    return await this.prisma.hero.update({
      where: {
        id,
      },
      data: {
        name: name || hero.name,
        description: description || hero.description,
        image: image || hero.image,
      },
    })
  }
}
