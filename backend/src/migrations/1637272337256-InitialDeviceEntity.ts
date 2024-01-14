import { MigrationInterface, QueryRunner, Table } from 'typeorm';

import { TABLE_PREFIX } from '../definitions';

export class InitialDeviceEntity1637272337256 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: TABLE_PREFIX + 'devices',
        columns: [
          {
            name: 'id',
            type: 'char',
            length: '36',
            generationStrategy: 'uuid',
            isPrimary: true,
          },
          {
            name: 'customer_id',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'name',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'device',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'online',
            type: 'tinyint',
            default: 0,
            isNullable: false,
          },
          {
            name: 'firmware_version',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
          {
            name: 'updated_at',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
        indices: [],
        uniques: [],
        foreignKeys: [
          {
            name: 'FK_b99931286d525c69fcaa4e32aaf',
            columnNames: ['customer_id'],
            referencedTableName: TABLE_PREFIX + 'customers',
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
          },
        ],
      }),
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(TABLE_PREFIX + 'devices', true);
  }
}
