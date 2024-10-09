import { IsNotEmpty, IsString, Length } from 'class-validator'

export class CreateHeroDto {
  @IsNotEmpty()
  @IsString()
  name: string

  @IsString()
  @IsNotEmpty()
  @Length(10, 200)
  description: string

  image?: string
}
