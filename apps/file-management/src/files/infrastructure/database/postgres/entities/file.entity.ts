import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('files')
export class File {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, name: 'hash_name' })
  hashName: string;

  @Column({ type: 'varchar', length: 255 })
  type: string;

  @Column({ type: 'integer' })
  size: number;

  @Column({
    type: 'varchar',
    length: 255,
    name: 'user_id',
    comment: 'ID of the user who uploaded the file',
  })
  userId: string;

  @Column({
    type: 'varchar',
    length: 255,
    name: 'tenant_id',
    comment: 'ID of the tenant',
  })
  tenantId: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
