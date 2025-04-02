import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ReferenceData } from './reference-data.entity';

@Entity('references')
export class Reference {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  // - `user_id` (UUID, FK -> `users.id`): Пользователь, создавший запись.
  @Column({ type: 'varchar' })
  user_id: string;

  // - `tenant_id` (UUID, FK -> `tenants.id`): Идентификатор тенанта.
  @Column({ type: 'varchar' })
  tenant_id: string;

  @Column({ type: 'integer', default: 0 })
  version: number;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => ReferenceData, (rd) => rd.reference)
  referenceData: ReferenceData[];
}
