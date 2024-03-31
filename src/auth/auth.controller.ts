import {
  Body,
  ConflictException,
  Controller,
  Get,
  Header,
  Param,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { NodemailerService } from 'src/nodemailer/nodemailer.service';
import { RefreshTokenService } from 'src/refresh-token/refresh-token.service';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { SignUpDto } from './dtos/signup.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly nodemailerService: NodemailerService,
  ) {}

  @Post('/signup')
  async signup(@Body() createUserInput: SignUpDto) {
    const userExists = await this.userService.getByUsernameOrEmail({
      username: createUserInput.username,
      email: createUserInput.email,
    });

    if (userExists) {
      if (userExists.username === createUserInput.username) {
        throw new ConflictException('Username already in use!');
      } else {
        throw new ConflictException('Email already in use!');
      }
    }

    const userWithToken = await this.authService.signup(createUserInput);

    await this.nodemailerService.sendVerificationEmail(
      userWithToken.email,
      userWithToken.verificationToken as string,
    );

    return userWithToken;
  }

  @Get('verify-email/:email')
  @Header('Cache-Control', 'no-cache, private')
  async verifyEmail(
    @Param('email') emailInput: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const user = await this.userService.getByUsernameOrEmail({
      email: emailInput,
    });

    if (!user || user.verificationToken !== req.query.token) {
      return res.redirect(
        301,
        `${process.env.FRONTEND_URL}/signup?success=false`,
      );
    }

    const updatedUser = await this.userService.update(user.id, {
      data: { verificationToken: null, emailVerified: true },
      select: { email: true, id: true, username: true },
    });

    const refreshToken = await this.refreshTokenService.create(
      user.id,
      req.ip ?? '',
      {
        select: {
          token: true,
          expiresAt: true,
        },
      },
    );

    const signedToken = this.authService.signJwtToken(updatedUser);
    const signedRefreshToken = this.authService.signJwtToken(
      refreshToken as any,
    );

    return res.redirect(
      301,
      `${process.env.FRONTEND_URL}?token=${signedToken}&refreshToken=${signedRefreshToken}`,
    );
  }
}
