import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DocumentVersions } from './document-versions.entity';
import { DocumentPermissions } from './document-permissions.entity';

@Entity('documents')
export class Document {
  // - `id` (UUID, первичный ключ): Уникальный идентификатор документа.
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // - `name` (VARCHAR): Название документа.
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @OneToOne(() => DocumentVersions)
  @JoinColumn({ name: 'current_version_id' })
  currentVersion: DocumentVersions;

  @OneToMany(() => DocumentVersions, (version) => version.document, {
    cascade: ['insert'],
  })
  versions: DocumentVersions[];

  // - `document_type` (VARCHAR): Тип документа (`text`, `table`).
  @Column({ type: 'varchar', length: 255 })
  documentType: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;

  @Column({
    type: 'varchar',
    length: 255,
    name: 'created_by',
    comment: 'ID of the user who uploaded the file',
  })
  createdBy: string;

  @Column({
    type: 'varchar',
    length: 255,
    name: 'tenant_id',
    comment: 'ID of the tenant',
  })
  tenantId: string;

  @OneToMany(() => DocumentPermissions, (dp) => dp.document, { cascade: true })
  documentPermissions: DocumentPermissions[];
}
