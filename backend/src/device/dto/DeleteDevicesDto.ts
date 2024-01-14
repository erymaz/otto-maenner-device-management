import { ApiProperty } from '@nestjs/swagger';
import * as Joi from 'joi';

export class DeleteDevicesDto {
  @ApiProperty()
  ids!: string[];
}

export const DeleteDevicesDtoSchema = Joi.object({
  ids: Joi.array().items(Joi.string().required()),
});
