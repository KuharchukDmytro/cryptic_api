import { IsEmail, IsString, Matches, MinLength } from 'class-validator';

export class SignUpDto {
  @IsString()
  @MinLength(5)
  @Matches(/^[a-zA-Z0-9_]*$/)
  username: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsEmail()
  email: string;
}
