import { IsString } from 'class-validator'

export class UpdateHeroDto {
  @IsString()
  name: string

  @IsString()
  description: string

  image?: string
}
