import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Reference } from './reference.entity';

@Entity('reference_versions')
export class ReferenceVersions {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Reference, (r) => r.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'reference_id' })
  reference: Reference;

  @Column({ type: 'integer' })
  version: number;

  @Column({ type: 'json' })
  data: any;

  // - `user_id` (UUID, FK -> `users.id`): Пользователь, создавший запись.
  @Column({ type: 'varchar' })
  user_id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
