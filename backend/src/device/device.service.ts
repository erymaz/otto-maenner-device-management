import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, In } from 'typeorm';

import { Device } from './device.entity';
import { CreateDeviceDto, UpdateDeviceDto, FilterDeviceDto, DeleteDevicesDto } from './dto';
import { Tuple } from 'src/models/Tuple';

@Injectable()
export class DeviceService {
  private readonly logger = new Logger(DeviceService.name);

  constructor(
    @InjectRepository(Device)
    private deviceRepo: Repository<Device>,
  ) {}

  async getDevice(id: string) {
    const result = await this.deviceRepo
      .createQueryBuilder('device')
      .leftJoinAndSelect('device.customer', 'customer')
      .where('device.id = :id', { id })
      .getOne();

    return result;
  }

  async getAllDevices(
    filter: FilterDeviceDto,
    offset: number,
    limit: number,
  ): Promise<Tuple<Device[], number>> {
    const where = {
      // To do
      ...(filter.customerId ? { customerId: filter.customerId } : {}),
      ...(filter.online ? { online: filter.online } : {}),
      ...(filter.firmwareVersion ? { firmwareVersion: filter.firmwareVersion } : {}),
      ...(filter.searchString ? { name: Like(`%${filter.searchString}%`) } : {}),
    };

    const result = await this.deviceRepo.find({
      join: {
        alias: "device",
        leftJoinAndSelect: {
          customer: "device.customer",
        },
      },
      where,
      order: filter.target ? {
        [filter.target]: filter.order
      } : {},
      skip: offset,
      take: limit,
    });

    const total = await this.deviceRepo.count({
      where,
    });

    return new Tuple(result, total);
  }

  async createDevice(data: CreateDeviceDto) {
    return await this.deviceRepo.save(data);
  }

  async updateDevice(id: string, data: UpdateDeviceDto): Promise<Device | null | undefined> {
    const device = await this.deviceRepo.findOne(id);
    if (!device) {
      return null;
    }
    Object.assign(device, data);
    await this.deviceRepo.save(device);

    return this.getDevice(id);
  }

  async deleteOne(id: string) {
    try {
      await this.deviceRepo.delete({ id });
      return true;
    } catch (e) {
      return false;
    }
  }

  async deleteMany(data: DeleteDevicesDto) {
    try {
      await this.deviceRepo.delete({ id: In(data.ids) });
      
      return true;
    } catch (e) {
      return false;
    }
  }
}
