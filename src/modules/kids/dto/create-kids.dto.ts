import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Gender } from 'src/schema/kids.schema';

export class KidDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  dob: number;

  @IsEnum(Gender)
  @IsNotEmpty()
  readonly gender: Gender;
}

export class UpdateKidDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsNumber()
  @IsOptional()
  dob?: number;

  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender;
}
export class KidResponseDto {
  id: string;
  name: string;
  dob: number;
  gender: Gender;
}
export class deleteKidResponseDto {
  message: string;
}
