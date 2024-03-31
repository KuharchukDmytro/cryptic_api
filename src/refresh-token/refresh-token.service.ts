import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { RefreshTokenReturnType } from './entities/refresh-token-return-type';
import * as crypto from 'crypto';
import { Prisma } from '@prisma/client';

@Injectable()
export class RefreshTokenService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(
    userId: number,
    ip: string,
    options?: Omit<Prisma.RefreshTokenCreateArgs, 'data'>,
  ): Promise<RefreshTokenReturnType> {
    const refreshToken = crypto.randomUUID();
    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + 14 * 24 * 60 * 60);

    const refreshTokenRecord = await this.databaseService.refreshToken.create({
      ...options,
      data: {
        userId,
        token: refreshToken,
        expiresAt: expiresAt.getTime(),
        ip,
      },
    });

    return {
      ...refreshTokenRecord,
      expiresAt: refreshTokenRecord.expiresAt.toString(),
    };
  }
}
