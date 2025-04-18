import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Script } from '../../../../../scripts/infrastructure/database/postgres/entities/script.entity';

@Entity('code_execution_history')
export class CodeExecutionHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Script, (s) => s.id)
  @JoinColumn({ name: 'script_id' })
  script: Script;

  @Column({
    type: 'integer',
    default: 0,
  })
  execution_time_ms: string;

  @Column({
    type: 'jsonb',
    default: null,
  })
  result: any;

  @Column({
    type: 'varchar',
    default: null,
    name: 'user_id',
    comment: 'initiator',
  })
  userId?: string;

  @Column({
    type: 'varchar',
    default: null,
    name: 'tenant_id',
  })
  tenantId?: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: string;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: string;
}
