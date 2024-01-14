import { ApiProperty } from '@nestjs/swagger';
import * as Joi from 'joi';

export class UpdateCustomerDto {
  @ApiProperty()
  name!: string;
}

export const UpdateCustomerDtoSchema = Joi.object({
  name: Joi.string().required(),
});
