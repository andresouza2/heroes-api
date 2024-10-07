import { Module } from '@nestjs/common'
import { HeroModule } from './hero/hero.module'
import { PrismaService } from './database/prisma.service'
import { HeroRepository } from './repositories/hero-repository'
import { PrismaHeroRepository } from './repositories/prisma/prisma-hero-repository'

@Module({
  imports: [HeroModule],
  controllers: [],
  providers: [
    PrismaService,
    {
      provide: HeroRepository,
      useClass: PrismaHeroRepository,
    },
  ],
})
export class AppModule {}
