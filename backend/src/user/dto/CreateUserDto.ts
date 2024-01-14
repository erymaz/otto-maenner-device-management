import { ApiProperty } from '@nestjs/swagger';
import * as Joi from 'joi';

export class CreateUserDto {
  @ApiProperty()
  email!: string;

  @ApiProperty()
  password!: string;
}

export const CreateUserDtoSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(4).required(),
});
