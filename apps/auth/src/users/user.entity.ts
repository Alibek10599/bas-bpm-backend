import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from '../roles/infrastructure/database/postgres/entities/role.entity';
import { Privilege } from '../privileges/infrastructure/database/postgres/entities/privilege.entity';

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @ManyToOne(() => Role, (r) => r.id, { eager: true })
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @ManyToMany(() => Privilege, (p) => p.users, { eager: true })
  @JoinTable()
  privileges: Privilege[];
}
