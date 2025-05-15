import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiTokenAccessType } from '../../../../domain/enums/api-token-access-type.enum';

@Entity('api_tokens')
export class ApiToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 32, name: 'access_type' })
  accessType: ApiTokenAccessType;

  @Column({ type: 'varchar', length: 255, unique: true })
  token: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;

  @Column({ type: 'timestamp', name: 'expired_at', default: null })
  expiredAt: Date;

  @Column({ type: 'varchar', length: 255, name: 'user_id', default: null })
  userId: string;

  @Column({ type: 'varchar', length: 255, name: 'tenant_id', default: null })
  tenantId: string;
}
