import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TaskStatuses } from '../../../enums/task-statuses.enum';
import { TaskStatusTransformer } from '../mappers/task-status.transformer';
import { TaskType } from '../../../enums/task-types.enum';
import { TaskTypeTransformer } from '../mappers/task-type.transformer';

@Entity('tasks')
export class TaskEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  //(UUID, FK -> `workflow_instances.id`, nullable): Идентификатор экземпляра процесса.
  @Column({ default: null, name: 'workflow_instance_id' })
  workflowInstanceId?: string;

  //(VARCHAR): Название задачи.
  @Column({ type: 'varchar' })
  name: string;

  //(TEXT, nullable): Описание задачи.
  @Column({ type: 'varchar', default: null })
  description?: string;

  //(VARCHAR): Статус задачи (`pending`, `in_progress`, `completed`).
  @Index()
  @Column({
    type: 'varchar',
    default: TaskStatuses.PENDING,
    transformer: new TaskStatusTransformer(),
  })
  status: TaskStatuses;

  //(VARCHAR): Тип задачи (`workflow`, `general`).
  @Column({
    type: 'varchar',
    default: TaskType.GENERAL,
    transformer: new TaskTypeTransformer(),
  })
  type: TaskType;

  //(UUID, FK -> `users.id`, nullable): Назначенный пользователь.
  @Index()
  @Column({
    type: 'varchar',
    default: null,
    name: 'assigned_to',
  })
  assignedTo?: string;

  //(UUID, FK -> `users.id`, nullable): Пользователь, которому делегирована задача.
  @Column({
    type: 'varchar',
    default: null,
    name: 'delegated_to',
  })
  delegatedTo?: string;

  //(JSON, nullable): Дополнительные данные.
  @Column({
    type: 'json',
    default: null,
  })
  metadata: any;

  //(UUID, FK -> `users.id`): Пользователь, создавший задачу.
  @Column({
    type: 'varchar',
    default: null,
    name: 'user_id',
  })
  userId?: string;

  //(UUID, FK -> `tenants.id`): Идентификатор тенанта.
  @Column({
    type: 'varchar',
    default: null,
    name: 'tenant_id',
  })
  tenantId?: string;

  //(TIMESTAMP): Дата создания.
  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: string;

  //(TIMESTAMP): Дата обновления.
  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: string;
}
