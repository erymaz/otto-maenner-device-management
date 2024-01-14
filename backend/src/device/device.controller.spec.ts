// import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as sinon from 'sinon';

import { DeviceController } from './device.controller';
import { DeviceService } from './device.service';

describe('Todo Controller', () => {
  let controller: DeviceController;
  let deviceService: { [key: string]: sinon.SinonSpy };

  beforeEach(async () => {
    deviceService = {};

    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeviceController],
      providers: [
        {
          provide: DeviceService,
          useValue: deviceService,
        },
      ],
    }).compile();

    controller = module.get<DeviceController>(DeviceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
