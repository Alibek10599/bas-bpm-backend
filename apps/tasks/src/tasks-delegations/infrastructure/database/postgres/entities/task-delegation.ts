import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Task } from '../../../../../tasks/infrastructure/database/postgres/entities/task';

@Entity('task_delegations')
export class TaskDelegation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Task, (task) => task.id)
  @JoinColumn({ name: 'task_id' })
  task: Task;

  @Column({ type: 'int', default: null })
  delegated_from: number;

  @Column({ type: 'int', default: null })
  delegated_to: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: string;
}
