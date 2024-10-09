import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

/**
 * Account entity represents a user's account within a blockchain-based application.
 * Each account is uniquely identified by a UUID and associated with a user.
 *
 * @entity
 */
@Entity({ name: 'account' })
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  publicKey: string;

  @Column()
  index: number;

  @Column()
  chain: string;

  @Column()
  isActivated: boolean;

  @Column()
  isPrivate: boolean;

  @ManyToOne(() => User, (relatedUser) => relatedUser.accounts)
  user: User;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
