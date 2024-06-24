import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SignUpDto } from './dtos/signup.dto';

import { JwtService, JwtSignOptions } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';
import { RefreshToken, User } from '@prisma/client';
import { TokenData } from './entities/token-data';
import { RefreshTokenData } from './entities/refresh-token-data';
import { RefreshTokenService } from '../refresh-token/refresh-token.service';
import { UserWithRefreshTokens } from '../user/entities/user-with-refresh-token.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(createUserInput: SignUpDto) {
    const { hashedPassword, salt } = await this.hashPassword(
      createUserInput.password,
    );
    const verificationCode = this.createVerificationCode();

    const user = await this.userService.create({
      data: {
        ...createUserInput,
        password: hashedPassword,
        verificationCode,
        salt,
      },
      select: {
        id: true,
        username: true,
        email: true,
        verificationCode: true,
      },
    });

    const payload = this.getUserPayloadForJwt(user);

    return {
      ...payload,
      verificationCode: user.verificationCode,
    };
  }

  async processSuccessSignin(user: UserWithRefreshTokens, ip: string) {
    let refreshToken = user.refreshTokens?.find((token) => token.ip === ip);

    if (!refreshToken) {
      refreshToken = await this.refreshTokenService.create(user.id, ip, {
        select: {
          token: true,
          expiresAt: true,
        },
      });
    }

    const userPayload = this.getUserPayloadForJwt(user);
    const signedToken = this.signJwtToken(userPayload);

    return {
      token: signedToken,
      refreshToken: (refreshToken as RefreshToken).token,
      user: userPayload,
    };
  }

  async processSuccessEmailVerification(userId: number, userIp: string) {
    const updatedUser = await this.userService.update({
      where: { id: userId },
      data: { verificationCode: null },
      select: { email: true, id: true, username: true },
    });

    const refreshToken = await this.refreshTokenService.create(userId, userIp, {
      select: {
        token: true,
        expiresAt: true,
      },
    });

    const signedToken = this.signJwtToken(updatedUser);
    const signedRefreshToken = this.signJwtToken(refreshToken);

    return {
      token: signedToken,
      refreshToken: signedRefreshToken,
    };
  }

  async validatePassword(
    password: string,
    hashedPassword: string,
    salt: string,
  ) {
    const hash = await bcrypt.hash(password, salt);

    return hash === hashedPassword;
  }

  async hashPassword(password: string) {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    return { hashedPassword, salt };
  }

  async verifyJwtToken(token: string): Promise<TokenData> {
    return this.jwtService.verify(token) as TokenData;
  }

  async verifyRefreshToken(token: string): Promise<RefreshTokenData> {
    return this.jwtService.verify(token) as RefreshTokenData;
  }

  async updateUserVerificationCode(email: string) {
    const newVerificationCode = this.createVerificationCode();

    await this.userService.update({
      where: {
        email,
      },
      data: {
        verificationCode: newVerificationCode,
      },
    });

    return newVerificationCode;
  }

  getUserPayloadForJwt(user: Partial<User>) {
    if (!user.email || !user.username || !user.id) {
      throw new InternalServerErrorException('Invalid jwt input');
    }

    return {
      email: user.email,
      username: user.username,
      id: user.id,
    };
  }

  signJwtToken(
    payload: TokenData | RefreshTokenData,
    options?: JwtSignOptions,
  ) {
    return this.jwtService.sign(payload, options);
  }

  createVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}
