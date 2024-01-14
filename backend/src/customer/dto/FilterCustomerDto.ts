import { ApiProperty } from '@nestjs/swagger';
import * as Joi from 'joi';

import {
  ENDPOINT_RESULT_DEFAULT_QUERY_ITEMS,
  ENDPOINT_RESULT_QUERY_LIMIT,
} from '../../definitions';

export class FilterCustomerDto {
  @ApiProperty({ required: false })
  countOfDevice!: number;

  @ApiProperty({ required: false })
  searchString!: string;

  @ApiProperty({ required: false })
  online?: boolean;

  @ApiProperty({ required: false })
  firmwareVersion!: string;

  @ApiProperty({ required: false })
  limit!: number;

  @ApiProperty({ required: false })
  page!: number;

  // For sorting
  @ApiProperty({ required: false })
  target!: string;

  @ApiProperty({ required: false })
  order!: 'ASC' | 'DESC';
}

export const FilterCustomerDtoSchema = Joi.object({
  countOfDevice:  Joi.number().min(0).optional(),
  searchString: Joi.string().optional(),
  online: Joi.boolean().optional(),
  firmwareVersion: Joi.string().optional(),
  limit: Joi.number()
    .min(1)
    .max(ENDPOINT_RESULT_QUERY_LIMIT)
    .default(ENDPOINT_RESULT_DEFAULT_QUERY_ITEMS)
    .optional(),
  page: Joi.number().min(0).default(1).optional(),
  target: Joi.string().optional(),
  order: Joi.string().default('DESC').optional(),
});
