import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'account ' })
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  publicKey: string;

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
