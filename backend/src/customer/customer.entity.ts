import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Generated, OneToMany, PrimaryColumn } from 'typeorm';

import { TABLE_PREFIX } from '../definitions';
import { Device } from '../device/device.entity';

export type CustomerId = string;

@Entity({ name: TABLE_PREFIX + 'customers' })
export class Customer {
  @PrimaryColumn({ type: 'char', length: 36, nullable: false })
  @Generated('uuid')
  @ApiProperty({ example: '10ac3aed-4979-4fe8-82d1-c43c7183d446' })
  id!: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  @ApiProperty()
  name!: string;

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

  @OneToMany(() => Device, device => device.customer)
  devices!: Device[];
}
