// 3p
import { createConnection, getManager } from 'typeorm';
import { User , Note , Category } from '../app/entities';

export const schema = {
  additionalProperties: false,
  properties: {
    email: {type: 'string'},
    note: {type: 'string'},
    category : {type: 'string'}
  },
  required: [ 'email','note','category' ],
  type: 'object',
};

export async function main(args: {email: string, note: string, category: string}) {
  const connection = await createConnection();
  try {
    const user = await connection.getRepository(User).findOne({email:args.email});
    const category = await connection.getRepository(Category).findOne({name:args.category});

    if(!user || !category){
      console.log(`user exist : ${user} \n category : ${category}`);
      return;
    }

    const note = new Note();
    note.note = args.note;
    note.user = user;
    note.category = category;
    console.log(await getManager().save(note)); 

  } catch (err){
    console.log(err.message);
  } finally {
    await connection.close();
  }

}