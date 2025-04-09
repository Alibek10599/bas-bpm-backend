import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Reference } from './reference.entity';

@Entity('reference_data')
@Index('IDX_reference_data_type_key', ['type', 'key'], { unique: false })
export class ReferenceData {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Reference, (r) => r.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'reference_id' })
  reference: Reference;

  @Column({ type: 'varchar' })
  type: string;

  @Column({ type: 'varchar' })
  key: string;

  @Column({ type: 'varchar' })
  value: string;
}
