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
import { Customer } from './customer.entity';
import { CustomerService } from './customer.service';
import { 
  CreateCustomerDto,
  CreateCustomerDtoSchema,
  UpdateCustomerDto,
  UpdateCustomerDtoSchema,
  FilterCustomerDto,
  FilterCustomerDtoSchema,
  DeleteCustomersDto,
  DeleteCustomersDtoSchema
} from './dto';
import { asResponse, DataResponse, PagedDataResponseMeta } from 'src/lib/data-response';

@Controller('customers')
@UseGuards(AuthGuard, RolesGuard)
@ApiTags('Customer Controller')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get('/:id')
  @Roles(RoleType.ADMIN, RoleType.SYSTEM, RoleType.USER)
  @ApiOperation({ summary: 'Get a customer by id' })
  @ApiResponse({ status: 401, description: 'Forbidden to access: Not authorized' })
  @ApiResponse({ status: 400, description: 'Invalid/missing param' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Customer with given id not found' })
  @ApiResponse({
    status: 200,
    description: 'The requested customer',
    type: Customer,
  })
  @ApiParam({ name: 'id', type: String })
  async getCustomer(
    @Param('id') id: string
  ): Promise<DataResponse<Customer>> {
    const customer = await this.customerService.getCustomer(id);
    if (!customer) {
      throw new NotFoundException(`Device '${id}' not found`);
    }
    return asResponse(customer);
  }

  @Get('/')
  @Roles(RoleType.ADMIN, RoleType.SYSTEM, RoleType.USER)
  @ApiOperation({ summary: 'Get all customers' })
  @ApiResponse({ status: 401, description: 'Forbidden to access: Not authorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({
    status: 200,
    description: 'All customers',
    type: Customer,
    isArray: true,
  })
  async getCustomers(
    @Query(new JoiPipe(FilterCustomerDtoSchema)) queryData: FilterCustomerDto,
  ): Promise<DataResponse<Customer[], PagedDataResponseMeta>> {
    const page = Math.max(1, queryData.page); // Ensure to start from page 1

    const result = await this.customerService.getCustomers(
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
  @ApiOperation({ summary: 'Create customer' })
  @ApiResponse({ status: 401, description: 'Forbidden to access: Not authorized' })
  @ApiResponse({ status: 400, description: 'Invalid/missing param' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({
    status: 201,
    description: 'The customer is created',
    type: Customer,
  })
  async createCustomer(
    @Body(new JoiPipe(CreateCustomerDtoSchema)) body: CreateCustomerDto
  ): Promise<DataResponse<Customer>> {
    const result = await this.customerService.createCustomer({ ...body });
    return asResponse(result);
  }

  @Put('/:id')
  @Roles(RoleType.ADMIN, RoleType.SYSTEM)
  @ApiOperation({ summary: 'Update customer by id' })
  @ApiResponse({ status: 401, description: 'Forbidden to access: Not authorized' })
  @ApiResponse({ status: 400, description: 'Invalid/missing param' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({
    status: 200,
    description: 'The customer is udpated',
    type: Customer,
  })
  @ApiParam({ name: 'id', type: String })
  async updateCustomer(
    @Param('id') id: string, 
    @Body(new JoiPipe(UpdateCustomerDtoSchema)) body: UpdateCustomerDto
  ): Promise<DataResponse<Customer>> {
    const result = await this.customerService.updateCustomer(id, body);
    if (!result) {
      throw new NotFoundException(`Customer '${id}' not found`);
    }
    return asResponse(result);
  }

  @Delete('/:id')
  @Roles(RoleType.ADMIN, RoleType.SYSTEM)
  @ApiOperation({ summary: 'Delete customer by id' })
  @ApiResponse({ status: 401, description: 'Forbidden to access: Not authorized' })
  @ApiResponse({ status: 400, description: 'Invalid/missing param' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({
    status: 200,
    description: 'Customer is deleted',
    type: Boolean
  })
  @ApiParam({ name: 'id', type: String })
  async deleteOne(
    @Param('id') id: string
  ): Promise<DataResponse<boolean>> {
    const result = await this.customerService.deleteOne(id);
    return asResponse(result);
  }

  @Delete('/')
  @Roles(RoleType.ADMIN, RoleType.SYSTEM)
  @ApiOperation({ summary: 'Delete customers by ids' })
  @ApiResponse({ status: 401, description: 'Forbidden to access: Not authorized' })
  @ApiResponse({ status: 400, description: 'Invalid/missing param' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({
    status: 200,
    description: 'Customers are deleted',
    type: Boolean
  })
  async deleteMany(
    @Body(new JoiPipe(DeleteCustomersDtoSchema)) body: DeleteCustomersDto
  ): Promise<DataResponse<boolean>> {
    const result = await this.customerService.deleteMany(body);
    return asResponse(result);
  }
}
