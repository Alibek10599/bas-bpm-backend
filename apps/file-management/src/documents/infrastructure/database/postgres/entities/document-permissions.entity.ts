import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Document } from './document.entity';
import { DocumentPermissionsTransformer } from '../mapper/document-permissions.transformer';
import { DocumentPermissionsEnum } from '../../../enums/document-permissions.enum';

@Entity('document_permissions')
export class DocumentPermissions {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @ManyToOne(() => Document, (document) => document.id)
  @JoinColumn({ name: 'document_id' })
  document: Document;

  @Column({
    type: 'varchar',
    length: 255,
    name: 'user_id',
    default: null,
  })
  userId: string;

  @Column({
    type: 'varchar',
    length: 255,
    name: 'group_id',
    default: null,
  })
  groupId: string;

  @Column({
    type: 'varchar',
    length: 255,
    name: 'permission_type',
    transformer: new DocumentPermissionsTransformer(),
  })
  permissionType: DocumentPermissionsEnum;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;
}
