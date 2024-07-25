import {
  Body,
  ConflictException,
  Controller,
  Get,
  Header,
  HttpException,
  Param,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { Request, RequestWithUser, Response } from 'express';
import { AuthService } from './auth.service';
import { ResendVerificationCodeDto } from './dtos/resend-verification-code.dto';
import { SignInDto } from './dtos/signin.dto';
import { SignUpDto } from './dtos/signup.dto';
import { VerifyEmailFromAppDto } from './dtos/verify-email-from-app.dto';
import { NodemailerService } from '../nodemailer/nodemailer.service';
import { RefreshTokenService } from '../refresh-token/refresh-token.service';
import { UserService } from '../user/user.service';
import { RefreshTokenDto } from './dtos/refresh-token.dto';
import { UserWithRefreshTokens } from '../user/entities/user-with-refresh-token.entity';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly nodemailerService: NodemailerService,
  ) {}

  @Post('signup')
  async signup(@Body() createUserInput: SignUpDto) {
    const user = await this.userService.getByUsernameOrEmail({
      username: createUserInput.username,
      email: createUserInput.email,
    });

    if (user) {
      if (user.username === createUserInput.username) {
        throw new ConflictException('Username already in use!');
      }

      throw new ConflictException('Email already in use!');
    }

    const signedUser = await this.authService.signup(createUserInput);

    await this.nodemailerService.sendVerificationEmail(
      signedUser.email,
      signedUser.verificationCode as string,
    );

    return signedUser;
  }

  @Post('signin')
  async signin(@Body() signinInput: SignInDto, @Req() req: Request) {
    const user = await this.userService.getByUsernameOrEmail(
      {
        email: signinInput.login,
        username: signinInput.login,
      },
      {
        include: {
          refreshTokens: true,
        },
      },
    );

    if (!user) {
      throw new HttpException('Incorrect login or password', 400);
    }

    const isPasswordValid = await this.authService.validatePassword(
      signinInput.password,
      user.password,
      user.salt,
    );

    if (!isPasswordValid) {
      throw new HttpException('Incorrect login or password', 400);
    }

    if (user.verificationCode) {
      throw new HttpException('Email not verified', 400);
    }

    const ip = req.ip ?? '';
    const data = await this.authService.processSuccessSignin(user, ip);

    return data;
  }

  @Get('verify-email/:email')
  @Header('Cache-Control', 'no-cache, private')
  async verifyEmail(
    @Param('email') email: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const user = await this.userService.getByUsernameOrEmail({
      email,
    });

    if (!user || user.verificationCode !== req.query.token) {
      return res.redirect(
        301,
        `${process.env.FRONTEND_URL}/signup?success=false`,
      );
    }

    const ip = req.ip ?? '';
    const { token, refreshToken } =
      await this.authService.processSuccessEmailVerification(user.id, ip);

    return res.redirect(
      301,
      `${process.env.FRONTEND_URL}?token=${token}&refreshToken=${refreshToken}`,
    );
  }

  @Post('verify-email')
  async verifyEmailFromApp(
    @Body() data: VerifyEmailFromAppDto,
    @Req() req: Request,
  ) {
    const user = await this.userService.getByUsernameOrEmail({
      email: data.login,
      username: data.login,
    });

    if (!user || user.verificationCode !== data.code) {
      throw new HttpException('Incorrect verification code', 400);
    }

    const ip = req.ip ?? '';
    const { token, refreshToken } =
      await this.authService.processSuccessEmailVerification(user.id, ip);

    return { token, refreshToken };
  }

  @Post('resend-verification-code')
  async resendVerificationCode(@Body() { email }: ResendVerificationCodeDto) {
    const newVerificationCode =
      await this.authService.updateUserVerificationCode(email);

    await this.nodemailerService.sendVerificationEmail(
      email,
      newVerificationCode,
    );

    return { message: 'Verification code resent successfully.' };
  }

  @Post('refresh-token-update')
  async refreshToken(
    @Req() req: RequestWithUser,
    @Body() refreshTokenDto: RefreshTokenDto,
  ) {
    const user = (await this.userService.getOne({
      where: {
        id: req.currentUserId,
      },
      include: {
        refreshTokens: true,
      },
    })) as UserWithRefreshTokens;

    const token = user?.refreshTokens?.find(
      (refreshToken) => refreshToken.token === refreshTokenDto.refreshToken,
    );
    const isValidToken = user?.refreshTokens && token;

    if (!isValidToken) {
      throw new HttpException('Invalid refresh token', 401);
    }
  }
}
