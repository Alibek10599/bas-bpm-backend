import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserIdToInteger1747213904754 implements MigrationInterface {
  name = 'UserIdToInteger1747213904754';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Update references table
    await queryRunner.query(`
            ALTER TABLE "references" 
            ALTER COLUMN "user_id" TYPE integer USING CAST(NULLIF(user_id, '') AS integer)
        `);

    // Update reference_versions table
    await queryRunner.query(`
            ALTER TABLE "reference_versions" 
            ALTER COLUMN "user_id" TYPE integer USING CAST(NULLIF(user_id, '') AS integer)
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revert references table
    await queryRunner.query(`
            ALTER TABLE "references" 
            ALTER COLUMN "user_id" TYPE varchar
        `);

    // Revert reference_versions table
    await queryRunner.query(`
            ALTER TABLE "reference_versions" 
            ALTER COLUMN "user_id" TYPE varchar
        `);
  }
}
