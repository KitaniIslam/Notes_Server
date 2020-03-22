// 3p
import { createConnection , getManager } from 'typeorm';

import { Category } from '../app/entities';

export const schema = {
    additionalProperties: false,
    properties: {
        name: { type: 'string' }
    },
    required: [ 'name' ],
    type: 'object',
}

export async function main(args: {name: string}){
    const category = new Category();
    category.name = args.name;
    
    await createConnection();

    try {
        console.log(await getManager().save(category));
    } catch(err) {
        console.log(err.message);
    }
}