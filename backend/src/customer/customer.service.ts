import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';

import { Customer } from './customer.entity';
import { CreateCustomerDto, UpdateCustomerDto, FilterCustomerDto, DeleteCustomersDto } from './dto';
import { Tuple } from 'src/models/Tuple';

@Injectable()
export class CustomerService {
  private readonly logger = new Logger(CustomerService.name);

  constructor(
    @InjectRepository(Customer)
    private customerRepo: Repository<Customer>,
  ) {}

  async getCustomer(id: string) {
    const result = await this.customerRepo
      .createQueryBuilder('customer')
      .leftJoinAndSelect('customer.devices', 'devices')
      .where('customer.id = :id', { id })
      .getOne();

    return result;
  }

  async getCustomers(
    filter: FilterCustomerDto,
    offset: number,
    limit: number,
  ): Promise<Tuple<Customer[], number>> {
    const query = this.customerRepo
      .createQueryBuilder('customer')
      .leftJoinAndSelect('customer.devices', 'devices')
      .loadRelationCountAndMap('customer.countOfDevice', 'customer.devices')

    if (filter.searchString) {
      query.where('LOWER(customer.name) LIKE :searchString', { searchString: `%${filter.searchString.toLowerCase()}%`})
    }

    if (filter.firmwareVersion) {
      query.andWhere('devices.firmwareVersion = :firmwareVersion', { firmwareVersion: filter.firmwareVersion})
    }

    if (filter.countOfDevice > -1) {
      query.andWhere('(SELECT COUNT(otto__devices.id) FROM otto__devices WHERE otto__devices.customer_id = customer.id) = :countOfDevice', {
        countOfDevice: filter.countOfDevice
      })
    }

    if (filter.target) {
      query.orderBy(`customer.${filter.target}`, filter.order);
    }

    const result = await query
      .skip(offset)
      .take(limit)
      .getMany();

    const total = await query.getCount();

    return new Tuple(result, total);
  }

  async createCustomer(data: CreateCustomerDto): Promise<Customer> {
    return await this.customerRepo.save(data);
  }

  async updateCustomer(id: string, data: UpdateCustomerDto): Promise<Customer | null> {
    const customer = await this.customerRepo.findOne(id);
    if (!customer) {
      return null;
    }
    Object.assign(customer, data);
    await this.customerRepo.save(customer);

    return customer;
  }

  async deleteOne(id: string): Promise<boolean> {
    try {
      await this.customerRepo.delete({ id });
      return true;
    } catch (e) {
      return false;
    }
  }

  async deleteMany(data: DeleteCustomersDto) {
    try {
      await this.customerRepo.delete({ id: In(data.ids) });
      
      return true;
    } catch (e) {
      return false;
    }
  }
}
