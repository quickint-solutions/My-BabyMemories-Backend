import { IsNotEmpty, IsOptional, IsString, IsArray, IsMongoId } from 'class-validator'

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
  date: string
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

  @IsString()
  @IsOptional()
  date?: string
}
export class deleteResponseDto {
  message: string
}
