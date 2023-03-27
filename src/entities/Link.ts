import { Entity, Column, PrimaryColumn, OneToOne, Relation, JoinColumn } from 'typeorm';
import { User } from './User';

@Entity()
export class Link {
  @PrimaryColumn({ unique: true })
  linkId: string;

  @Column({ unique: true })
  originalUrl: string;

  @Column({ default: null })
  lastAccessedOn: Date;

  @Column({ default: 0 })
  numHits: number;

  @OneToOne(() => User, (user) => user.link)
  @JoinColumn()
  user: Relation<User>;

}