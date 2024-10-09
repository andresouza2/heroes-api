import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { CreateHeroDto } from './dto/create-hero.dto'
import { HeroRepository } from 'src/repositories/hero-repository'
import { UpdateHeroDto } from './dto/update-hero.dto'
import { FileInterceptor } from '@nestjs/platform-express'

@Controller('/heroes')
export class HeroController {
  constructor(private readonly heroRepository: HeroRepository) {}

  @Get()
  async findAll() {
    return await this.heroRepository.findAll()
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    try {
      return await this.heroRepository.findById(id)
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(@Body() createHero: CreateHeroDto, @UploadedFile() file: Express.Multer.File) {
    const { name, description } = createHero

    if (!file) throw new BadRequestException('File is required')

    try {
      const hero = await this.heroRepository.create(
        {
          name,
          description,
          image: file.originalname,
        },
        file,
      )

      return hero
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.heroRepository.deleteById(id)
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('file'))
  async updateById(
    @Param('id') id: string,
    @Body() updateHero: UpdateHeroDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const { name, description, image } = updateHero

    const hero = await this.heroRepository.updateById(
      id,
      {
        name,
        description,
        image,
      },
      file,
    )

    return hero
  }
}
