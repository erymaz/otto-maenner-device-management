// import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as sinon from 'sinon';

import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';

describe('Todo Controller', () => {
  let controller: CustomerController;
  let customerService: { [key: string]: sinon.SinonSpy };

  beforeEach(async () => {
    customerService = {};

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomerService],
      providers: [
        {
          provide: CustomerService,
          useValue: customerService,
        },
      ],
    }).compile();

    controller = module.get<CustomerController>(CustomerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
