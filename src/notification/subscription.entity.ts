import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

/**
 * Represents a subscription entity in the system.
 *
 * The Subscription class is used to manage subscription information. It includes details such as
 * subscription ID, name, associated users, creation timestamp, and update timestamp.
 *
 * This class utilizes TypeORM decorators to define the entity and its properties, making it compatible
 * with a relation database schema.
 *
 * - `id`: A unique identifier for the subscription, generated as a UUID.
 * - `name`: The name of the subscription.
 * - `users`: A collection of users associated with this subscription.
 * - `createdAt`: The timestamp when the subscription was created, defaults to the current timestamp.
 * - `updatedAt`: The timestamp when the subscription was last updated, defaults to the current timestamp.
 */
@Entity({ name: 'subscription' })
export class Subscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @OneToMany(() => User, (user) => user.subscription, {
    cascade: true,
    eager: true,
  })
  users: User[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
