import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('files')
export class File {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  hashName: string;

  @Column({ type: 'varchar', length: 255 })
  type: string;

  @Column({ type: 'integer' })
  size: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
