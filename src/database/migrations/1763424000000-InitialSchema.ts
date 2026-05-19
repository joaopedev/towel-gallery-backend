import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
  TableUnique,
} from 'typeorm';

export class InitialSchema1763424000000 implements MigrationInterface {
  name = 'InitialSchema1763424000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');

    await queryRunner.createTable(
      new Table({
        name: 'admin_users',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          {
            name: 'createdAt',
            type: 'timestamp with time zone',
            default: 'now()',
          },
          {
            name: 'updatedAt',
            type: 'timestamp with time zone',
            default: 'now()',
          },
          {
            name: 'username',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'passwordHash',
            type: 'varchar',
            isNullable: false,
          },
        ],
      }),
      true,
    );
    await queryRunner.createUniqueConstraint(
      'admin_users',
      new TableUnique({
        name: 'UQ_admin_users_username',
        columnNames: ['username'],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'color_options',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          {
            name: 'createdAt',
            type: 'timestamp with time zone',
            default: 'now()',
          },
          {
            name: 'updatedAt',
            type: 'timestamp with time zone',
            default: 'now()',
          },
          {
            name: 'name',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'hexCode',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'imageUrl',
            type: 'varchar',
            isNullable: true,
          },
        ],
      }),
      true,
    );
    await queryRunner.createUniqueConstraint(
      'color_options',
      new TableUnique({
        name: 'UQ_color_options_name',
        columnNames: ['name'],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'letter_styles',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          {
            name: 'createdAt',
            type: 'timestamp with time zone',
            default: 'now()',
          },
          {
            name: 'updatedAt',
            type: 'timestamp with time zone',
            default: 'now()',
          },
          {
            name: 'name',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'description',
            type: 'varchar',
            default: "''",
          },
          {
            name: 'previewText',
            type: 'varchar',
            default: "'Maria'",
          },
          {
            name: 'imageUrl',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'accentColor',
            type: 'varchar',
            default: "'#8c4b5a'",
          },
          {
            name: 'clickCount',
            type: 'integer',
            default: 0,
          },
        ],
      }),
      true,
    );
    await queryRunner.createUniqueConstraint(
      'letter_styles',
      new TableUnique({
        name: 'UQ_letter_styles_name',
        columnNames: ['name'],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'towel_types',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          {
            name: 'createdAt',
            type: 'timestamp with time zone',
            default: 'now()',
          },
          {
            name: 'updatedAt',
            type: 'timestamp with time zone',
            default: 'now()',
          },
          {
            name: 'name',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'description',
            type: 'varchar',
            default: "''",
          },
          {
            name: 'imageUrl',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'clickCount',
            type: 'integer',
            default: 0,
          },
        ],
      }),
      true,
    );
    await queryRunner.createUniqueConstraint(
      'towel_types',
      new TableUnique({
        name: 'UQ_towel_types_name',
        columnNames: ['name'],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'towel_models',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          {
            name: 'createdAt',
            type: 'timestamp with time zone',
            default: 'now()',
          },
          {
            name: 'updatedAt',
            type: 'timestamp with time zone',
            default: 'now()',
          },
          {
            name: 'name',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'description',
            type: 'varchar',
            default: "''",
          },
          {
            name: 'imageUrl',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'clickCount',
            type: 'integer',
            default: 0,
          },
          {
            name: 'towelTypeId',
            type: 'uuid',
            isNullable: false,
          },
        ],
      }),
      true,
    );

    await queryRunner.createTable(
      new Table({
        name: 'ready_made_items',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          {
            name: 'createdAt',
            type: 'timestamp with time zone',
            default: 'now()',
          },
          {
            name: 'updatedAt',
            type: 'timestamp with time zone',
            default: 'now()',
          },
          {
            name: 'title',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'description',
            type: 'varchar',
            default: "''",
          },
          {
            name: 'imageUrl',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'priceLabel',
            type: 'varchar',
            default: "''",
          },
          {
            name: 'towelTypeId',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'towelModelId',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'letterStyleId',
            type: 'uuid',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    await queryRunner.createTable(
      new Table({
        name: 'feedbacks',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          {
            name: 'createdAt',
            type: 'timestamp with time zone',
            default: 'now()',
          },
          {
            name: 'updatedAt',
            type: 'timestamp with time zone',
            default: 'now()',
          },
          {
            name: 'authorName',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'message',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'approved',
            type: 'boolean',
            default: false,
          },
          {
            name: 'rating',
            type: 'integer',
            default: 5,
          },
          {
            name: 'readyMadeItemId',
            type: 'uuid',
            isNullable: false,
          },
        ],
      }),
      true,
    );

    await queryRunner.createTable(
      new Table({
        name: 'towel_type_color_options',
        columns: [
          {
            name: 'towelTypeId',
            type: 'uuid',
            isPrimary: true,
          },
          {
            name: 'colorOptionId',
            type: 'uuid',
            isPrimary: true,
          },
        ],
      }),
      true,
    );

    await queryRunner.createTable(
      new Table({
        name: 'towel_model_color_options',
        columns: [
          {
            name: 'towelModelId',
            type: 'uuid',
            isPrimary: true,
          },
          {
            name: 'colorOptionId',
            type: 'uuid',
            isPrimary: true,
          },
        ],
      }),
      true,
    );

    await queryRunner.createTable(
      new Table({
        name: 'ready_made_item_color_options',
        columns: [
          {
            name: 'readyMadeItemId',
            type: 'uuid',
            isPrimary: true,
          },
          {
            name: 'colorOptionId',
            type: 'uuid',
            isPrimary: true,
          },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      'towel_models',
      new TableIndex({
        name: 'IDX_towel_models_towelTypeId',
        columnNames: ['towelTypeId'],
      }),
    );
    await queryRunner.createIndex(
      'ready_made_items',
      new TableIndex({
        name: 'IDX_ready_made_items_towelTypeId',
        columnNames: ['towelTypeId'],
      }),
    );
    await queryRunner.createIndex(
      'ready_made_items',
      new TableIndex({
        name: 'IDX_ready_made_items_towelModelId',
        columnNames: ['towelModelId'],
      }),
    );
    await queryRunner.createIndex(
      'ready_made_items',
      new TableIndex({
        name: 'IDX_ready_made_items_letterStyleId',
        columnNames: ['letterStyleId'],
      }),
    );
    await queryRunner.createIndex(
      'feedbacks',
      new TableIndex({
        name: 'IDX_feedbacks_readyMadeItemId',
        columnNames: ['readyMadeItemId'],
      }),
    );

    await queryRunner.createForeignKey(
      'towel_models',
      new TableForeignKey({
        name: 'FK_towel_models_towelTypeId',
        columnNames: ['towelTypeId'],
        referencedTableName: 'towel_types',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'ready_made_items',
      new TableForeignKey({
        name: 'FK_ready_made_items_towelTypeId',
        columnNames: ['towelTypeId'],
        referencedTableName: 'towel_types',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createForeignKey(
      'ready_made_items',
      new TableForeignKey({
        name: 'FK_ready_made_items_towelModelId',
        columnNames: ['towelModelId'],
        referencedTableName: 'towel_models',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
    );
    await queryRunner.createForeignKey(
      'ready_made_items',
      new TableForeignKey({
        name: 'FK_ready_made_items_letterStyleId',
        columnNames: ['letterStyleId'],
        referencedTableName: 'letter_styles',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createForeignKey(
      'feedbacks',
      new TableForeignKey({
        name: 'FK_feedbacks_readyMadeItemId',
        columnNames: ['readyMadeItemId'],
        referencedTableName: 'ready_made_items',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'towel_type_color_options',
      new TableForeignKey({
        name: 'FK_towel_type_color_options_towelTypeId',
        columnNames: ['towelTypeId'],
        referencedTableName: 'towel_types',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createForeignKey(
      'towel_type_color_options',
      new TableForeignKey({
        name: 'FK_towel_type_color_options_colorOptionId',
        columnNames: ['colorOptionId'],
        referencedTableName: 'color_options',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'towel_model_color_options',
      new TableForeignKey({
        name: 'FK_towel_model_color_options_towelModelId',
        columnNames: ['towelModelId'],
        referencedTableName: 'towel_models',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createForeignKey(
      'towel_model_color_options',
      new TableForeignKey({
        name: 'FK_towel_model_color_options_colorOptionId',
        columnNames: ['colorOptionId'],
        referencedTableName: 'color_options',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'ready_made_item_color_options',
      new TableForeignKey({
        name: 'FK_ready_made_item_color_options_readyMadeItemId',
        columnNames: ['readyMadeItemId'],
        referencedTableName: 'ready_made_items',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createForeignKey(
      'ready_made_item_color_options',
      new TableForeignKey({
        name: 'FK_ready_made_item_color_options_colorOptionId',
        columnNames: ['colorOptionId'],
        referencedTableName: 'color_options',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('ready_made_item_color_options', true);
    await queryRunner.dropTable('towel_model_color_options', true);
    await queryRunner.dropTable('towel_type_color_options', true);
    await queryRunner.dropTable('feedbacks', true);
    await queryRunner.dropTable('ready_made_items', true);
    await queryRunner.dropTable('towel_models', true);
    await queryRunner.dropTable('towel_types', true);
    await queryRunner.dropTable('letter_styles', true);
    await queryRunner.dropTable('color_options', true);
    await queryRunner.dropTable('admin_users', true);
  }
}
