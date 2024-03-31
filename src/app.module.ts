import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { RefreshTokenModule } from './refresh-token/refresh-token.module';
import { NodemailerModule } from './nodemailer/nodemailer.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    DatabaseModule,
    RefreshTokenModule,
    NodemailerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
