import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JoiPipe } from 'nestjs-joi';

import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { RoleType } from 'src/models/role-type';
import { Device } from './device.entity';
import { DeviceService } from './device.service';
import {
  CreateDeviceDto,
  CreateDeviceDtoSchema,
  UpdateDeviceDto,
  UpdateDeviceDtoSchema,
  FilterDeviceDto,
  FilterDeviceDtoSchema,
  DeleteDevicesDto,
  DeleteDevicesDtoSchema
} from './dto';
import { asResponse, DataResponse, PagedDataResponseMeta } from 'src/lib/data-response';

@Controller('devices')
@UseGuards(AuthGuard, RolesGuard)
@ApiTags('Device Controller')
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  @Get('/:id')
  @Roles(RoleType.ADMIN, RoleType.SYSTEM, RoleType.USER)
  @ApiOperation({ summary: 'Get a single device by id' })
  @ApiResponse({ status: 401, description: 'Forbidden to access: Not authorized' })
  @ApiResponse({ status: 400, description: 'Invalid/missing param' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Device with given id not found' })
  @ApiResponse({
    status: 200,
    description: 'The requested maintenance',
    type: Device,
  })
  @ApiParam({ name: 'id', type: String })
  async getDevice(
    @Param('id') id: string
  ): Promise<DataResponse<Device>> {
    const device = await this.deviceService.getDevice(id);
    if (!device) {
      throw new NotFoundException(`Device '${id}' not found`);
    }
    return asResponse(device);
  }

  @Get('/')
  @Roles(RoleType.ADMIN, RoleType.SYSTEM, RoleType.USER)
  @ApiOperation({ summary: 'Get all devices' })
  @ApiResponse({ status: 401, description: 'Forbidden to access: Not authorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({
    status: 200,
    description: 'All devices',
    type: Device,
    isArray: true,
  })
  async getAllDevices(
    @Query(new JoiPipe(FilterDeviceDtoSchema)) queryData: FilterDeviceDto,
  ): Promise<DataResponse<Device[], PagedDataResponseMeta>> {
    const page = Math.max(1, queryData.page); // Ensure to start from page 1

    const result = await this.deviceService.getAllDevices(
      queryData,
      (page - 1) * queryData.limit,
      queryData.limit,
    );

    return asResponse(
      result.first,
      {
        page,
        pageCount: Math.ceil(result.second / queryData.limit),
        total: result.second,
        count: result.first.length,
      },
    );
  }

  @Post('/')
  @Roles(RoleType.ADMIN, RoleType.SYSTEM)
  @ApiOperation({ summary: 'Create device' })
  @ApiResponse({ status: 401, description: 'Forbidden to access: Not authorized' })
  @ApiResponse({ status: 400, description: 'Invalid/missing param' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({
    status: 201,
    description: 'The device is created',
    type: Device,
  })
  async createDevice(
    @Body(new JoiPipe(CreateDeviceDtoSchema)) body: CreateDeviceDto
  ): Promise<DataResponse<Device>> {
    const result = await this.deviceService.createDevice({ ...body });
    return asResponse(result);
  }

  @Put('/:id')
  @Roles(RoleType.ADMIN, RoleType.SYSTEM)
  @ApiOperation({ summary: 'Update device by id' })
  @ApiResponse({ status: 401, description: 'Forbidden to access: Not authorized' })
  @ApiResponse({ status: 400, description: 'Invalid/missing param' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({
    status: 200,
    description: 'The device is udpated',
    type: Device,
  })
  @ApiParam({ name: 'id', type: String })
  async updateDevice(
    @Param('id') id: string, 
    @Body(new JoiPipe(UpdateDeviceDtoSchema)) body: UpdateDeviceDto
  ): Promise<DataResponse<Device>> {
    const result = await this.deviceService.updateDevice(id, body);
    if (!result) {
      throw new NotFoundException(`Device '${id}' not found`);
    }
    return asResponse(result);
  }

  @Delete('/:id')
  @Roles(RoleType.ADMIN, RoleType.SYSTEM)
  @ApiOperation({ summary: 'Delete device by id' })
  @ApiResponse({ status: 401, description: 'Forbidden to access: Not authorized' })
  @ApiResponse({ status: 400, description: 'Invalid/missing param' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({
    status: 200,
    description: 'Device is deleted',
    type: Boolean
  })
  @ApiParam({ name: 'id', type: String })
  async deleteOne(
    @Param('id') id: string
  ): Promise<DataResponse<boolean>> {
    const result = await this.deviceService.deleteOne(id);
    return asResponse(result);
  }

  @Delete('/')
  @Roles(RoleType.ADMIN, RoleType.SYSTEM)
  @ApiOperation({ summary: 'Delete devices by ids' })
  @ApiResponse({ status: 401, description: 'Forbidden to access: Not authorized' })
  @ApiResponse({ status: 400, description: 'Invalid/missing param' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({
    status: 200,
    description: 'Devices are deleted',
    type: Boolean
  })
  async deleteMany(
    @Body(new JoiPipe(DeleteDevicesDtoSchema)) body: DeleteDevicesDto
  ): Promise<DataResponse<boolean>> {
    const result = await this.deviceService.deleteMany(body);
    return asResponse(result);
  }
}
