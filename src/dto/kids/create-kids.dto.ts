import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Gender } from 'src/schema/kids.schema';
import { CreateUserDto } from '../user/create-user.dto';

export class KidDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @Type(() => Date) // ✅ Converts string to Date
  @IsDate()         // ✅ Validates it's a real Date
  dob: Date;

  @IsEnum(Gender)
  @IsNotEmpty()
  readonly gender: Gender;

  @Type(() => CreateUserDto)
  readonly parent_user?: CreateUserDto;
}
