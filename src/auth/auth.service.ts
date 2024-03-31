import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { SignUpDto } from './dtos/signup.dto';

import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { RefreshTokenService } from 'src/refresh-token/refresh-token.service';

import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(createUserInput: SignUpDto) {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserInput.password, salt);
    const verificationToken = this.createVerificationToken();

    const user = await this.userService.create({
      data: {
        ...createUserInput,
        password: hashedPassword,
        verificationToken,
        salt,
      },
      select: {
        id: true,
        username: true,
        email: true,
        verificationToken: true,
      },
    });

    const payload = { username: user.username, id: user.id, email: user.email };
    const token = this.signJwtToken(payload);

    return {
      ...user,
      token,
    };
  }

  signJwtToken(payload: Record<string, unknown>, options?: JwtSignOptions) {
    return this.jwtService.sign(payload, options);
  }

  createVerificationToken() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}
