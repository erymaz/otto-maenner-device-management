import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';

import { ConfigModule } from '../config/config.module';
import { DeviceController } from './device.controller';
import { Device } from './device.entity';
import { DeviceService } from './device.service';

@Module({
  imports: [TypeOrmModule.forFeature([Device]), HttpModule, ConfigModule, AuthModule],
  controllers: [DeviceController],
  providers: [DeviceService],
})
export class DeviceModule {}
