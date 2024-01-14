import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JoiPipe } from 'nestjs-joi';
import { asResponse, DataResponse } from 'src/lib/data-response';

import { CreateUserDto, CreateUserDtoSchema } from './dto/CreateUserDto';
import { User } from './user.entity';
import { UserService } from './user.service';

@Controller('users')
@ApiTags('User Controller')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({ status: 400, description: 'Invalid/missing param' })
  @ApiResponse({
    status: 201,
    description: 'User is created',
    type: User,
  })
  async createUser(
    @Body(new JoiPipe(CreateUserDtoSchema)) createUserDto: CreateUserDto,
  ): Promise<DataResponse<CreateUserDto>> {
    const userExists = await this.userService.exists({
      where: {
        email: createUserDto.email?.toLowerCase(),
      },
    });
    if (!userExists) {
      return asResponse(await this.userService.create(createUserDto));
    }
    throw new HttpException('auth.EXISTS', HttpStatus.FORBIDDEN);
  }
}
