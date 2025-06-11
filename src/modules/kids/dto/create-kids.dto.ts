import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { IUser } from 'src/modules/user/user.interface';
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

  @IsString()
  @IsNotEmpty()
  userId: IUser | string;
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

  @IsString()
  @IsOptional()
  userId?: IUser;
}
export class KidResponseDto {
  id: string;
  name: string;
  dob: number;
  gender: Gender;
  userId: IUser;
}
export class deleteKidResponseDto {
  message: string;
}
