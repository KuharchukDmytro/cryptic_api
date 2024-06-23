import { IsString, Length, Matches, MinLength } from 'class-validator';

export class VerifyEmailFromAppDto {
  @IsString({ message: 'Invalid code' })
  @Length(6, 6, { message: 'Invalid code length' })
  @Matches(/\d/, { message: 'Code should be a number' })
  code: string;

  @IsString()
  @MinLength(5)
  login: string;
}
