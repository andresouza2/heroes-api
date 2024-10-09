import { IsString, Length } from 'class-validator'

export class UpdateHeroDto {
  @IsString()
  name: string

  @IsString()
  @Length(10, 200)
  description: string

  image?: string
}
