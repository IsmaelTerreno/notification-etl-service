import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Subscription } from './subscription.entity';
import { Account } from './account.entity';

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  username: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  photoUrl: string;

  @ManyToOne(
    () => Subscription,
    (relatedSubscription) => relatedSubscription.users,
  )
  subscription: Subscription;

  @OneToMany(() => Account, (relatedAccount) => relatedAccount.user, {
    cascade: true,
    eager: true,
  })
  accounts: Account[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
