import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';

import { ConfigModule } from '../config/config.module';
import { CustomerController } from './customer.controller';
import { Customer } from './customer.entity';
import { CustomerService } from './customer.service';

@Module({
  imports: [TypeOrmModule.forFeature([Customer]), HttpModule, ConfigModule, AuthModule],
  controllers: [CustomerController],
  providers: [CustomerService],
})
export class CustomerModule {}
