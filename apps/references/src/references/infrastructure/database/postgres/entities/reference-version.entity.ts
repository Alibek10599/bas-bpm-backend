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

  @Column({ type: 'int' })
  user_id: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
