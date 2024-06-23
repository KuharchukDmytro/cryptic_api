import { IsString, MinLength } from 'class-validator';

export class SignInDto {
  @IsString()
  @MinLength(5)
  login: string;

  @IsString()
  @MinLength(8)
  password: string;
}
