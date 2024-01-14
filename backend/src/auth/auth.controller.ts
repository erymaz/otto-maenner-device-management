import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JoiPipe } from 'nestjs-joi';
import { asResponse, DataResponse } from 'src/lib/data-response';
import { UserService } from 'src/user/user.service';

import { AuthService } from './auth.service';
import { AuthLoginDto, AuthLoginDtoSchema } from './dto/AuthLoginDto';
import { AuthTokenDto } from './dto/AuthTokenDto';

@Controller('auth')
@ApiTags('Auth Controller')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'Login' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({
    status: 201,
    description: 'Login',
    type: AuthTokenDto,
  })
  async login(
    @Body(new JoiPipe(AuthLoginDtoSchema)) authLoginDto: AuthLoginDto,
  ): Promise<DataResponse<AuthTokenDto>> {
    const { email, password } = authLoginDto;
    const user = await this.userService.findByEmail(email);
    if (user && (await user.validatePassword(password))) {
      return asResponse(await this.authService.createToken(user));
    }
    throw new HttpException('auth.INVALID', HttpStatus.FORBIDDEN);
  }
}
