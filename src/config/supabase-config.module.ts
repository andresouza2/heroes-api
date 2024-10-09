import { Module } from '@nestjs/common'
import { SupabaseConfigService } from './supabase-config.service'

@Module({
  providers: [SupabaseConfigService],
  exports: [SupabaseConfigService],
  controllers: [],
  imports: [],
})
export class SupabaseConfigModule {}
