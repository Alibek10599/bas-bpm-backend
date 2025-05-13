import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EntityChanges } from '@app/common';
import { Privilege } from './privilege.entity';

@Entity('privilege_versions')
export class PrivilegeVersion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'jsonb' })
  changes: EntityChanges<Privilege>;

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

  @ManyToOne(() => Privilege, (r) => r.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'privilege_id' })
  privilege: Privilege;
}
