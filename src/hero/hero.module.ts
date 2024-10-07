import { Module } from '@nestjs/common'
import { HeroController } from './hero.conrtoller'
import { PrismaService } from 'src/database/prisma.service'
import { HeroRepository } from 'src/repositories/hero-repository'
import { PrismaHeroRepository } from 'src/repositories/prisma/prisma-hero-repository'

@Module({
  imports: [],
  controllers: [HeroController],
  providers: [
    PrismaService,
    {
      provide: HeroRepository,
      useClass: PrismaHeroRepository,
    },
  ],
})
export class HeroModule {}
