import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TaskEntity } from '../../../../../tasks/infrastructure/database/postgres/entities/task.entity';

@Entity('task_delegations')
export class TaskDelegation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  //(UUID, FK -> `tasks.id`): Идентификатор задачи.
  @ManyToOne(() => TaskEntity, (task) => task.id)
  @JoinColumn({ name: 'task_id' })
  task: TaskEntity;

  //(UUID, FK -> `users.id`): От кого делегирована.
  @Column({ type: 'varchar', default: null })
  delegated_from: string;

  //(UUID, FK -> `users.id`): Кому делегирована.
  @Column({ type: 'varchar', default: null })
  delegated_to: string;

  //(TIMESTAMP): Дата создания.
  @CreateDateColumn({ type: 'timestamp' })
  created_at: string;
}
