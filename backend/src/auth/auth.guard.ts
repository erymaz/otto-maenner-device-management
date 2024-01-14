import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';

import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    try {
      if (!req.headers['authorization']) {
        throw new HttpException('auth.FORBIDDEN', HttpStatus.FORBIDDEN);
      }
      const payload = this.authService.validateToken(req.headers['authorization']?.split(' ')[1]);
      const res = await this.authService.validate(payload);
      if (!res) {
        throw new HttpException('auth.FORBIDDEN', HttpStatus.FORBIDDEN);
      }
      req.user = res;
      return true;
    } catch (error) {
      throw new HttpException('auth.FORBIDDEN', HttpStatus.FORBIDDEN);
    }
  }
}
