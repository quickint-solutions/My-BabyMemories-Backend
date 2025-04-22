import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
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
