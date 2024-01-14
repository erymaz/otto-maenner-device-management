import { ApiProperty } from '@nestjs/swagger';
import * as Joi from 'joi';

export class DeleteCustomersDto {
  @ApiProperty()
  ids!: string[];
}

export const DeleteCustomersDtoSchema = Joi.object({
  ids: Joi.array().items(Joi.string().required()),
});
