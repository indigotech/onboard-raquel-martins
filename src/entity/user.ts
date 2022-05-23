import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  JoinColumn
} from 'typeorm';
import { Address } from './address';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  birthDate?: string;

  @OneToMany(() => Address, (address) => address.user, {})
  @JoinColumn()
  addresses?: Address[];
}
