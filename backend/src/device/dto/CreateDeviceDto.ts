import { ApiProperty } from '@nestjs/swagger';
import * as Joi from 'joi';

export class CreateDeviceDto {
  @ApiProperty()
  name!: string;

  @ApiProperty()
  customerId!: string;

  @ApiProperty()
  device!: string;

  @ApiProperty()
  firmwareVersion!: string;
}

export const CreateDeviceDtoSchema = Joi.object({
  name: Joi.string().required(),
  customerId: Joi.alternatives(Joi.string(), null).optional(),
  device: Joi.string().required()
});
