import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Document } from './document.entity';
import { File } from '../../../../../files/infrastructure/database/postgres/entities/file.entity';

@Entity('document_versions')
export class DocumentVersions {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Document, (document) => document.id)
  @JoinColumn({ name: 'document_id' })
  document: Document;

  @ManyToOne(() => File, (file) => file.id)
  @JoinColumn({ name: 'file_id' })
  file: File;

  @Column({ type: 'integer', default: 0 })
  version: number;

  @Column({
    type: 'varchar',
    length: 255,
    name: 'created_by',
  })
  createdBy: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;
}
