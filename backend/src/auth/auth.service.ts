import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';

import { AuthTokenDto } from './dto/AuthTokenDto';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService, private readonly jwtService: JwtService) {}

  async createToken(user: User): Promise<AuthTokenDto> {
    const payload = { id: user.id, email: user.email, roles: user.roles };
    return new AuthTokenDto(this.jwtService.sign(payload));
  }

  async validate(payload: any): Promise<User> {
    const user = await this.userService.findByEmail(payload.email);
    if (!user) {
      throw new HttpException('auth.FORBIDDEN', HttpStatus.FORBIDDEN);
    }
    return user;
  }

  validateToken(jwt: string) {
    return this.jwtService.verify(jwt);
  }
}
