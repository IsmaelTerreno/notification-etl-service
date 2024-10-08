import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Subscription } from './subscription.entity';
import { Account } from './account.entity';

/**
 * Represents a user entity.
 *
 * Properties:
 *
 * @property {string} id - The unique identifier for the user, automatically generated as a UUID.
 * @property {string} userId - The identifier for the user.
 * @property {string} username - The username of the user.
 * @property {string} name - The name of the user.
 * @property {string} email - The email address of the user.
 * @property {string} photoUrl - The URL of the user's photo.
 * @property {Subscription} subscription - The subscription associated with the user.
 * @property {Account[]} accounts - The accounts associated with the user. This relationship is cascaded and is eager-loaded.
 * @property {Date} createdAt - The timestamp when the user was created. Defaults to the current timestamp.
 * @property {Date} updatedAt - The timestamp when the user was last updated. Defaults to the current timestamp.
 */
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
