import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserIdToInteger1747213887727 implements MigrationInterface {
  name = 'UserIdToInteger1747213887727';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Update tasks table
    await queryRunner.query(`
            ALTER TABLE "tasks" 
            ALTER COLUMN "user_id" TYPE integer USING CAST(NULLIF(user_id, '') AS integer),
            ALTER COLUMN "assigned_to" TYPE integer USING CAST(NULLIF(assigned_to, '') AS integer),
            ALTER COLUMN "delegated_to" TYPE integer USING CAST(NULLIF(delegated_to, '') AS integer)
        `);

    // Update task_versions table
    await queryRunner.query(`
            ALTER TABLE "task_versions" 
            ALTER COLUMN "user_id" TYPE integer USING CAST(NULLIF(user_id, '') AS integer)
        `);

    // Update task_delegations table
    await queryRunner.query(`
            ALTER TABLE "task_delegations" 
            ALTER COLUMN "delegated_from" TYPE integer USING CAST(NULLIF(delegated_from, '') AS integer),
            ALTER COLUMN "delegated_to" TYPE integer USING CAST(NULLIF(delegated_to, '') AS integer)
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revert tasks table
    await queryRunner.query(`
            ALTER TABLE "tasks" 
            ALTER COLUMN "user_id" TYPE varchar,
            ALTER COLUMN "assigned_to" TYPE varchar,
            ALTER COLUMN "delegated_to" TYPE varchar
        `);

    // Revert task_versions table
    await queryRunner.query(`
            ALTER TABLE "task_versions" 
            ALTER COLUMN "user_id" TYPE varchar
        `);

    // Revert task_delegations table
    await queryRunner.query(`
            ALTER TABLE "task_delegations" 
            ALTER COLUMN "delegated_from" TYPE varchar,
            ALTER COLUMN "delegated_to" TYPE varchar
        `);
  }
}
