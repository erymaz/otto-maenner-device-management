import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from 'src/config/config.module';
import { ConfigService } from 'src/config/config.service';
import { UserService } from 'src/user/user.service';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  controllers: [AuthController],
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async () => ({
        secret: process.env.APP_JWT_SECRET,
        signOptions: {
          expiresIn: Number(process.env.APP_JWT_EXPIRESIN),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, UserService],
  exports: [AuthService, UserService],
})
export class AuthModule {}
