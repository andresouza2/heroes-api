import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { CreateHeroDto } from './dto/create-hero.dto'
import { HeroRepository } from 'src/repositories/hero-repository'
import { UpdateHeroDto } from './dto/update-hero.dto'

@Controller('/heroes')
export class HeroController {
  constructor(private heroRepository: HeroRepository) {}

  @Get()
  async findAll() {
    return await this.heroRepository.findAll()
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.heroRepository.findById(id)
  }

  @Post()
  async create(@Body() createHero: CreateHeroDto) {
    const { name, description, image } = createHero

    const hero = await this.heroRepository.create({
      name,
      description,
      image,
    })

    return hero
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.heroRepository.deleteById(id)
  }

  @Put(':id')
  async updateById(@Param('id') id: string, @Body() updateHero: UpdateHeroDto) {
    const { name, description, image } = updateHero

    const hero = await this.heroRepository.updateById(id, {
      name,
      description,
      image,
    })

    return hero
  }
}
