// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Column, Entity, PrimaryGeneratedColumn , ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Category } from './category.entity';

@Entity()
export class Note {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  note: string;

  @ManyToOne(type => User , user => user.notes )
  user: User;

  @ManyToOne(type => Category, category => category.note)
  category: Category;

}
