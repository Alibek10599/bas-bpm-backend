import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from './role.entity';
import { EntityChanges } from '@app/common';

@Entity('role_versions')
export class RoleVersion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'jsonb' })
  changes: EntityChanges<Role>;

  @Column({
    type: 'integer',
    default: 1,
  })
  version: number;

  @Column({
    type: 'varchar',
    default: null,
    name: 'user_id',
  })
  userId?: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: string;

  @ManyToOne(() => Role, (r) => r.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'role_id' })
  role: Role;
}
