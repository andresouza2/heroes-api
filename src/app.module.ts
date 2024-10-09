import { Module } from '@nestjs/common'
import { HeroModule } from './modules/hero/hero.module'
import { PrismaService } from './database/prisma.service'
import { HeroRepository } from './repositories/hero-repository'
import { PrismaHeroRepository } from './repositories/prisma/prisma-hero-repository'
import { SupabaseConfigModule } from './config/supabase-config.module'
import { SupabaseConfigService } from './config/supabase-config.service'

@Module({
  imports: [HeroModule, SupabaseConfigModule],
  controllers: [],
  providers: [
    PrismaService,
    {
      provide: HeroRepository,
      useClass: PrismaHeroRepository,
    },
    SupabaseConfigService,
  ],
})
export class AppModule {}
