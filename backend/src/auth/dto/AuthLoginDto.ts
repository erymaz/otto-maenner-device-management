import { ApiProperty } from '@nestjs/swagger';
import * as Joi from 'joi';

export class AuthLoginDto {
  @ApiProperty()
  email!: string;

  @ApiProperty()
  password!: string;
}

export const AuthLoginDtoSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
