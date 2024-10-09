import { Hero } from '@prisma/client'
import { HeroRepository } from '../hero-repository'
import { PrismaService } from 'src/database/prisma.service'
import { randomUUID } from 'node:crypto'
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { CreateHeroDto } from 'src/modules/hero/dto/create-hero.dto'
import { SupabaseConfigService } from 'src/config/supabase-config.service'

@Injectable()
export class PrismaHeroRepository implements HeroRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly supabase: SupabaseConfigService,
  ) {}

  async create(body: CreateHeroDto, file: Express.Multer.File): Promise<Hero & { imageUrl: string }> {
    const { name, description } = body

    // subir arquivo para o supabase
    const fileUploaded = await this.supabase.uploadFile(file)

    // gerar url da imagem
    const getUrlFile = await this.supabase.createSignedUrl(fileUploaded.path, 60)

    // create hero into prisma
    const hero = await this.prisma.hero.create({
      data: {
        id: randomUUID(),
        name,
        description,
        image: fileUploaded.path,
      },
    })

    try {
      const response = {
        id: hero.id,
        name: hero.name,
        description: hero.description,
        image: hero.image,
        imageUrl: getUrlFile ?? '',
      }

      return response
    } catch (error) {
      throw new BadRequestException('Erro ao cadastrar um herói ' + error)
    }
  }

  async findAll(): Promise<(Hero & { imageUrl: string })[]> {
    // buscar todos os herois no prisma
    const heroes = await this.prisma.hero.findMany()

    const listFile = await this.supabase.listFiles()

    const imageUrlArray = await Promise.all(
      listFile.map(async (file) => {
        // retornar nome e url
        const response = await this.supabase.createSignedUrl(file.name, 60)
        return { name: file.name, url: response }
      }),
    )

    const heroesWithImageUrl = heroes.map((hero) => ({
      ...hero,
      imageUrl: imageUrlArray.find((url) => url.name === hero.image)?.url ?? '',
    }))

    return heroesWithImageUrl
  }

  async findById(id: string): Promise<Hero & { imageUrl: string }> {
    const hero = await this.prisma.hero.findUnique({
      where: {
        id,
      },
    })

    if (!hero) throw new NotFoundException('Hero not found')

    // get url of the image
    const fileResponse = await this.supabase.createSignedUrl(hero.image, 60)

    return {
      id: hero.id,
      name: hero.name,
      description: hero.description,
      image: hero.image,
      imageUrl: fileResponse,
    }
  }

  async deleteById(id: string) {
    const hero = await this.prisma.hero.findUnique({
      where: {
        id,
      },
    })

    if (!hero) throw new NotFoundException('Hero not found')

    // deletar uma imagem já existente caso exista
    if (hero.image) await this.supabase.deleteFile(hero.image)

    await this.prisma.hero.delete({
      where: {
        id,
      },
    })
  }

  async updateById(
    id: string,
    body: { name?: string; description?: string; image?: string },
    file?: Express.Multer.File,
  ) {
    const { name, description } = body

    const hero = await this.prisma.hero.findUnique({
      where: {
        id,
      },
    })

    if (!hero) throw new NotFoundException('Hero not found')

    let getUrlFile = ''
    let getFileName = ''
    if (file) {
      // deletar uma imagem já existente caso exista
      if (hero.image) await this.supabase.deleteFile(hero.image)

      // subir nova imagem para o supabase
      const fileResult = await this.supabase.uploadFile(file)

      // gerar url da imagem
      const urlResult = await this.supabase.createSignedUrl(fileResult.path, 60)
      getUrlFile = urlResult

      getFileName = fileResult.path
    } else {
      getFileName = hero.image
      // gerar url da imagem
      const urlResult = await this.supabase.createSignedUrl(getFileName, 60)
      getUrlFile = urlResult
    }

    const response = await this.prisma.hero.update({
      where: {
        id,
      },
      data: {
        name: name ?? hero.name,
        description: description ?? hero.description,
        image: getFileName ?? hero.image,
      },
    })

    return {
      ...response,
      imageUrl: getUrlFile ?? '',
    }
  }
}
