import { IsNotEmpty, IsString } from 'class-validator'

export class CreateHeroDto {
  @IsNotEmpty()
  @IsString()
  name: string

  @IsString()
  @IsNotEmpty()
  description: string

  @IsString()
  image?: string
}
