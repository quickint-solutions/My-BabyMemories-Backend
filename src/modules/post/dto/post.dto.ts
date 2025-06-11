import { IsNotEmpty, IsOptional, IsString, IsArray, IsMongoId, IsNumber } from 'class-validator'

export class postDto {
  @IsArray()
  @IsMongoId({ each: true })
  @IsNotEmpty()
  kidsId: string[]

  @IsString()
  @IsOptional()
  userId: string

  @IsString()
  @IsOptional()
  description: string

  @IsOptional()
  @IsNotEmpty()
  date: number
}
export class updatePostDto {
  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  kidsId?: string[]

  @IsMongoId()
  @IsOptional()
  userId?: string

  @IsString()
  @IsOptional()
  description?: string

  @IsNumber()
  @IsOptional()
  date?: number
}
export class deleteResponseDto {
  message: string
}
