import { ApiProperty } from '@nestjs/swagger';
import * as Joi from 'joi';

export class UpdateDeviceDto {
  @ApiProperty()
  name!: string;

  @ApiProperty()
  customerId!: string;

  @ApiProperty()
  device!: string;

  @ApiProperty()
  firmwareVersion!: string;
}

export const UpdateDeviceDtoSchema = Joi.object({
  name: Joi.string().required(),
  customerId: Joi.alternatives(Joi.string(), null).optional(),
  device: Joi.string().required()
});
