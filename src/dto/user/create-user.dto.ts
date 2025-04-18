import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, MinLength, MaxLength, IsEnum, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Relation, Role } from 'src/schema/user.schema';
import { KidDto } from '../kids/create-kids.dto';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  readonly name: string;

  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  readonly password: string;

  @IsEnum(Relation)
  @IsNotEmpty()
  readonly relation: Relation;

  @IsEnum(Role)
  @IsOptional()
  readonly role: Role;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => KidDto)
  @IsOptional()
  readonly children?: KidDto[];
}

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  readonly password: string;
}
export class UpdateUserDto extends PartialType(CreateUserDto){}
