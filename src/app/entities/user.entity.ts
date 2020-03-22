import { hashPassword } from '@foal/core';
import { Column, Entity, PrimaryGeneratedColumn , OneToMany } from 'typeorm';
import { Note } from './note.entity';

@Entity()
export class User {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  async setPassword(password: string) {
    this.password = await hashPassword(password);
  }

  @OneToMany(type => Note , note => note.user)
  notes: Note[]

}
