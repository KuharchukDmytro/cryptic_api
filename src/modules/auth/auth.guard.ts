import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext) {
    console.log('req');

    const req = context.switchToHttp().getRequest();

    try {
      const authHeader = req.headers.authorization;
      const bearer = authHeader.split(' ')[0];
      const token = authHeader.split(' ')[1];

      if (bearer !== 'Bearer' || !token) {
        throw new UnauthorizedException({
          message: 'User unauthorized',
        });
      }

      const jwtData = await this.authService.verifyJwtToken(token);

      if (!jwtData) {
        throw new UnauthorizedException({
          message: 'User unauthorized',
        });
      }

      req.currentUserId = jwtData.id;
      req.currentUserUsername = jwtData.username;
      req.currentUserEmail = jwtData.email;

      return true;
    } catch {
      throw new UnauthorizedException({
        message: 'User unauthorized',
      });
    }
  }
}
