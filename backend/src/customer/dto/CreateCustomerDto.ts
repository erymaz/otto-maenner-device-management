import { ApiProperty } from '@nestjs/swagger';
import * as Joi from 'joi';

export class CreateCustomerDto {
  @ApiProperty()
  name!: string;
}

export const CreateCustomerDtoSchema = Joi.object({
  name: Joi.string().required(),
});
