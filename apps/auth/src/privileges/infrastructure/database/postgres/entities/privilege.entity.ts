import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AccessesModel } from '@app/common';
import { User } from '../../../../../users/user.entity';

@Entity('privileges')
export class Privilege {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'jsonb', default: null })
  accesses: AccessesModel;

  @Column({
    type: 'varchar',
    default: null,
    name: 'user_id',
  })
  userId?: string;

  @Column({
    type: 'varchar',
    default: null,
    name: 'tenant_id',
  })
  tenantId?: string;

  @ManyToMany(() => User, (u) => u.privileges, { onDelete: 'CASCADE' })
  users: User[];

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: string;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: string;
}
