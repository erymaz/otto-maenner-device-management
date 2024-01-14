import { ApiProperty } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';
import { RoleType } from 'src/models/role-type';
import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  Generated,
  PrimaryColumn,
} from 'typeorm';

import { TABLE_PREFIX } from '../definitions';

@Entity({ name: TABLE_PREFIX + 'users' })
export class User extends BaseEntity {
  @PrimaryColumn({ type: 'char', length: 36, nullable: false })
  @Generated('uuid')
  @ApiProperty({ example: '10ac3aed-4979-4fe8-82d1-c43c7183d446' })
  id!: string;

  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  @ApiProperty()
  email!: string;

  @Column({ type: 'varchar', nullable: false })
  @ApiProperty()
  password!: string;

  @Column({ type: 'varchar', nullable: true, select: false })
  @ApiProperty()
  resetPasswordToken!: string | null;

  @Column({ type: 'json', nullable: true })
  roles!: RoleType[];

  @Column({ type: 'datetime', nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  @ApiProperty({ example: new Date().toISOString() })
  createdAt!: Date;

  @Column({
    type: 'datetime',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  @ApiProperty({ example: new Date().toISOString() })
  updatedAt!: Date;

  @BeforeInsert()
  @BeforeUpdate()
  emailToLowerCase() {
    this.email = this.email.toLowerCase();
  }

  @BeforeInsert()
  defaultRoles() {
    if (!this.roles?.length) {
      this.roles = [RoleType.USER];
    }
  }

  @BeforeInsert()
  async hashPassword(): Promise<void> {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
