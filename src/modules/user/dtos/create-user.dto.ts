import { Prisma } from '@prisma/client';
import {
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class CreateUserDto implements Prisma.UserCreateInput {
  @IsString()
  @MinLength(5)
  @Matches(/^[a-zA-Z0-9_]*$/)
  username: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  salt: string;

  @IsEmail()
  email: string;

  @IsString()
  verificationToken?: string;

  @IsString()
  @IsOptional()
  avatarUrl?: string;
}
