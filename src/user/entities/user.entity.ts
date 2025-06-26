import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum USER_ROLE {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

@Entity({ name: 'user' })
export class UserEntity {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'varchar' })
  email?: string;

  @Column({ type: 'varchar' })
  password?: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  nickname: string;

  @Column({ type: 'enum', enum: USER_ROLE, default: USER_ROLE.USER })
  role: USER_ROLE;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text' })
  img_url: string;

  @Column({ type: 'text' })
  location: string;

  @Column({ type: 'tinyint', default: 0 })
  status: boolean;

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;
}
