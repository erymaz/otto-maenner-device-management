import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';

import { ConfigModule } from '../config/config.module';
import { UserController } from './user.controller';
import { User } from './user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User]), HttpModule, ConfigModule, AuthModule],
  controllers: [UserController],
})
export class UserModule {}
