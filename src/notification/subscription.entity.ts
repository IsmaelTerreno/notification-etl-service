import { Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'subscription ' })
export class Subscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(() => User, (user) => user, {
    cascade: true,
    eager: true,
  })
  users: User[];
}
