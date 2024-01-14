import { Injectable } from '@nestjs/common';
import { RoleType } from 'src/models/role-type';

import { CreateUserDto } from './dto/CreateUserDto';
import { User } from './user.entity';

@Injectable()
export class UserService {
  async create(createUserDto: CreateUserDto) {
    const user = User.create(createUserDto) as any;
    user.roles = [RoleType.ADMIN];
    await user.save();

    delete user.password;
    delete user.resetPasswordToken;
    return user;
  }

  async findById(id: string) {
    return await User.findOne(id);
  }

  async findByEmail(email: string) {
    return await User.findOne({
      where: {
        email: email?.toLowerCase(),
      },
    });
  }

  async exists(filter = {}): Promise<boolean> {
    return (await User.count(filter)) > 0;
  }
}
