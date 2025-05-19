import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AccessesModel } from '@app/common';

@Entity('api_tokens')
export class ApiToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'jsonb' })
  accesses: AccessesModel;

  @Column({ type: 'varchar', length: 255, unique: true })
  token: string;

  /**
   * От лица этого пользователя будут совершаться все действия
   * */
  @Column({ type: 'integer', name: 'actor_id', default: null })
  actorId: number;

  @Column({ type: 'integer', name: 'user_id', default: null })
  userId: number;

  @Column({ type: 'varchar', length: 255, name: 'tenant_id', default: null })
  tenantId: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;

  @Column({ type: 'timestamp', name: 'expired_at', default: null })
  expiredAt: Date;
}
