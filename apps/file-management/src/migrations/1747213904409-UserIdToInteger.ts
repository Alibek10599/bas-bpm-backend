import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserIdToInteger1747213904409 implements MigrationInterface {
  name = 'UserIdToInteger1747213904409';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Update document_permissions table
    await queryRunner.query(`
            ALTER TABLE "document_permissions" 
            ALTER COLUMN "user_id" TYPE integer USING CAST(NULLIF(user_id, '') AS integer)
        `);

    // Update documents table
    await queryRunner.query(`
            ALTER TABLE "documents" 
            ALTER COLUMN "created_by" TYPE integer USING CAST(NULLIF(created_by, '') AS integer)
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revert document_permissions table
    await queryRunner.query(`
            ALTER TABLE "document_permissions" 
            ALTER COLUMN "user_id" TYPE varchar
        `);

    // Revert documents table
    await queryRunner.query(`
            ALTER TABLE "documents" 
            ALTER COLUMN "created_by" TYPE varchar
        `);
  }
}
