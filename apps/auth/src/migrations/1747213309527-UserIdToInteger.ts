import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserIdToInteger1747213309527 implements MigrationInterface {
  name = 'UserIdToInteger1747213309527';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create a temporary column for new integer IDs
    await queryRunner.query(`ALTER TABLE "users" ADD COLUMN "new_id" SERIAL`);

    // Update references in tasks table
    await queryRunner.query(`
            ALTER TABLE "tasks" 
            ALTER COLUMN "user_id" TYPE integer USING NULL,
            ALTER COLUMN "assigned_to" TYPE integer USING NULL,
            ALTER COLUMN "delegated_to" TYPE integer USING NULL
        `);

    // Update references in task_versions table
    await queryRunner.query(`
            ALTER TABLE "task_versions" 
            ALTER COLUMN "user_id" TYPE integer USING NULL
        `);

    // Update references in task_delegations table
    await queryRunner.query(`
            ALTER TABLE "task_delegations" 
            ALTER COLUMN "delegated_from" TYPE integer USING NULL,
            ALTER COLUMN "delegated_to" TYPE integer USING NULL
        `);

    // Update references in document_permissions table
    await queryRunner.query(`
            ALTER TABLE "document_permissions" 
            ALTER COLUMN "user_id" TYPE integer USING NULL
        `);

    // Update references in documents table
    await queryRunner.query(`
            ALTER TABLE "documents" 
            ALTER COLUMN "created_by" TYPE integer USING NULL
        `);

    // Update references in references table
    await queryRunner.query(`
            ALTER TABLE "references" 
            ALTER COLUMN "user_id" TYPE integer USING NULL
        `);

    // Update references in reference_versions table
    await queryRunner.query(`
            ALTER TABLE "reference_versions" 
            ALTER COLUMN "user_id" TYPE integer USING NULL
        `);

    // Drop the old primary key constraint
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "PK_users_id"`,
    );

    // Drop the old id column
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "id"`);

    // Rename new_id to id
    await queryRunner.query(
      `ALTER TABLE "users" RENAME COLUMN "new_id" TO "id"`,
    );

    // Add primary key constraint to the new id column
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "PK_users_id" PRIMARY KEY ("id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revert users table changes
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "PK_users_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" RENAME COLUMN "id" TO "new_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD COLUMN "id" uuid DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "PK_users_id" PRIMARY KEY ("id")`,
    );

    // Revert tasks table
    await queryRunner.query(`
            ALTER TABLE "tasks" 
            ALTER COLUMN "user_id" TYPE uuid USING NULL,
            ALTER COLUMN "assigned_to" TYPE uuid USING NULL,
            ALTER COLUMN "delegated_to" TYPE uuid USING NULL
        `);

    // Revert task_versions table
    await queryRunner.query(`
            ALTER TABLE "task_versions" 
            ALTER COLUMN "user_id" TYPE uuid USING NULL
        `);

    // Revert task_delegations table
    await queryRunner.query(`
            ALTER TABLE "task_delegations" 
            ALTER COLUMN "delegated_from" TYPE uuid USING NULL,
            ALTER COLUMN "delegated_to" TYPE uuid USING NULL
        `);

    // Revert document_permissions table
    await queryRunner.query(`
            ALTER TABLE "document_permissions" 
            ALTER COLUMN "user_id" TYPE uuid USING NULL
        `);

    // Revert documents table
    await queryRunner.query(`
            ALTER TABLE "documents" 
            ALTER COLUMN "created_by" TYPE uuid USING NULL
        `);

    // Revert references table
    await queryRunner.query(`
            ALTER TABLE "references" 
            ALTER COLUMN "user_id" TYPE uuid USING NULL
        `);

    // Revert reference_versions table
    await queryRunner.query(`
            ALTER TABLE "reference_versions" 
            ALTER COLUMN "user_id" TYPE uuid USING NULL
        `);

    // Drop the temporary column
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "new_id"`);
  }
}
