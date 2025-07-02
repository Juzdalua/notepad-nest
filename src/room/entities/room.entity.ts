import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum ROOM_TYPE {
  DETAIL = 'DETAIL',
  RANDOM = 'RANDOM',
}

@Entity({ name: 'room' })
export class RoomEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: ROOM_TYPE, default: ROOM_TYPE.DETAIL })
  type: ROOM_TYPE;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'int' })
  created_user_id: number;

  @Column({ type: 'int', nullable: true, default: null })
  joined_user_id?: number;

  @Column({ type: 'datetime', nullable: true, default: null })
  joined_at?: Date;

  @Column({ type: 'tinyint', nullable: false, default: 1 })
  status: number;

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;
}
