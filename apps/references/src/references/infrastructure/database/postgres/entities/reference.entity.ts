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

  @Column({ type: 'int' })
  user_id: number;

  @Column({ type: 'varchar' })
  tenant_id: string;

  @Column({ type: 'integer', default: 0 })
  version: number;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => ReferenceData, (rd) => rd.reference, {
    cascade: true,
  })
  referenceData: ReferenceData[];
}
