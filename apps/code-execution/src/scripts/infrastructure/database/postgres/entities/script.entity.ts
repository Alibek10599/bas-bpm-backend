import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProgrammingLanguages } from '../../../enums/programming-languages.enum';
import { ScriptLanguageTransformer } from '../mappers/script.language.transformer';

@Entity('scripts')
export class Script {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text' })
  script: string;

  @Column({
    type: 'varchar',
    length: 10,
    transformer: new ScriptLanguageTransformer(),
  })
  language: ProgrammingLanguages;

  @Column({
    type: 'varchar',
    default: null,
    name: 'user_id',
  })
  userId?: string;

  @Column({
    type: 'varchar',
    default: null,
    name: 'tenant_id',
  })
  tenantId?: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: string;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: string;
}
