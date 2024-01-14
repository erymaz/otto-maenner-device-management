import { ApiProperty } from '@nestjs/swagger';
import { Column, BeforeInsert, Entity, Generated, ManyToOne, PrimaryColumn } from 'typeorm';

import { Customer } from '../customer/customer.entity';
import { TABLE_PREFIX } from '../definitions';

export type DeviceId = string;

@Entity({ name: TABLE_PREFIX + 'devices' })
export class Device {
  @PrimaryColumn({ type: 'char', length: 36, nullable: false })
  @Generated('uuid')
  @ApiProperty({ example: '10ac3aed-4979-4fe8-82d1-c43c7183d446' })
  id!: string;

  @Column({ type: 'char', length: 36, nullable: true })
  @ApiProperty()
  customerId!: string | null;

  @Column({ type: 'varchar', length: 255, nullable: false })
  @ApiProperty()
  name!: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  @ApiProperty()
  device!: string;

  @ApiProperty({ default: false })
  @Column({ type: 'boolean', nullable: false, default: false })
  online!: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @ApiProperty()
  firmwareVersion!: string | null;

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

  @ManyToOne(() => Customer, customer => customer.devices, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  customer!: Customer | null;
}
