import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Task } from '../../../../../tasks/infrastructure/database/postgres/entities/task';

@Entity('task_versions')
export class TaskVersion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  //(UUID, FK -> `tasks.id`): Идентификатор задачи.
  @ManyToOne(() => Task, (task) => task.id)
  @JoinColumn({ name: 'task_id' })
  task: Task;

  //(JSON): Измененные данные.
  @Column({ type: 'json' })
  changed_data: any;

  //(INT): Номер версии.
  @Column({ type: 'integer' })
  version: number;

  //(TIMESTAMP): Дата создания.
  @CreateDateColumn({ type: 'timestamp' })
  created_at: string;

  //(UUID, FK -> `users.id`): Пользователь, внесший изменения.
  @Column({ type: 'varchar', default: null })
  user_id: string;
}
