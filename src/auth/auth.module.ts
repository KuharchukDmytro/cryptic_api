import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { RefreshTokenModule } from 'src/refresh-token/refresh-token.module';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { NodemailerModule } from 'src/nodemailer/nodemailer.module';

@Global()
@Module({
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
  imports: [
    UserModule,
    RefreshTokenModule,
    NodemailerModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '15m' },
    }),
  ],
})
export class AuthModule {}
