import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1747815153949 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1
        FROM pg_matviews
        WHERE matviewname = 'role_hierarchy'
      ) THEN
        EXECUTE $view$
          CREATE MATERIALIZED VIEW role_hierarchy AS
          WITH RECURSIVE descendants AS (
            SELECT
              id AS root_id,
              id AS related_id,
              'self' AS direction
            FROM roles
    
            UNION ALL
    
            SELECT
              d.root_id,
              r.id AS related_id,
              'descendant' AS direction
            FROM descendants d
            JOIN roles r ON r.parent_id = d.related_id
          ),
          ancestors AS (
            SELECT
              id AS root_id,
              id AS related_id,
              'self' AS direction
            FROM roles
    
            UNION ALL
    
            SELECT
              a.root_id,
              r.parent_id AS related_id,
              'ancestor' AS direction
            FROM ancestors a
            JOIN roles r ON r.id = a.related_id
            WHERE r.parent_id IS NOT NULL
          )
    
          SELECT * FROM descendants WHERE direction != 'self'
          UNION
          SELECT * FROM ancestors WHERE direction != 'self';
        $view$;
      END IF;
    END$$;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DO $$
      BEGIN
        IF EXISTS (
          SELECT 1
          FROM pg_matviews
          WHERE matviewname = 'role_hierarchy'
        ) THEN
          EXECUTE 'DROP MATERIALIZED VIEW role_hierarchy';
        END IF;
      END$$;`);
  }
}
