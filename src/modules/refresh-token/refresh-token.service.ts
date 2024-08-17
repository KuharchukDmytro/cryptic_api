import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as crypto from 'crypto';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class RefreshTokenService {
  constructor(private readonly databaseService: DatabaseService) {}

  getOne(options: Prisma.RefreshTokenFindFirstArgs) {
    return this.databaseService.refreshToken.findFirst(options);
  }

  async create(
    userId: number,
    ip: string,
    options?: Omit<Prisma.RefreshTokenCreateArgs, 'data'>,
  ) {
    const refreshToken = crypto.randomUUID();
    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + 14 * 24 * 60 * 60);

    const refreshTokenRecord = await this.databaseService.refreshToken.create({
      ...options,
      data: {
        userId,
        token: refreshToken,
        expiresAt,
        ip,
      },
    });

    return refreshTokenRecord;
  }

  async updateTokenAndExpires(id: number) {
    const refreshToken = crypto.randomUUID();
    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + 14 * 24 * 60 * 60);

    const refreshTokenRecord = await this.databaseService.refreshToken.update({
      where: {
        id,
      },
      data: {
        token: refreshToken,
        expiresAt,
      },
    });

    return refreshTokenRecord;
  }

  remove(options: Prisma.RefreshTokenDeleteArgs) {
    return this.databaseService.refreshToken.delete(options);
  }
}
