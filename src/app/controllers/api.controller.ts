import { Context, Get, HttpResponseOK , TokenRequired , ValidateParams, HttpResponseBadRequest } from '@foal/core';
import { TypeORMStore } from '@foal/typeorm';
import {User} from '../entities/user.entity';
import { getRepository } from 'typeorm';

@TokenRequired({ store: TypeORMStore })
export class ApiController {

  @Get('/notes')
  @ValidateParams({ properties: { email: { type: 'string',format : 'email' } }, type: 'object' })
  async notes(ctx: Context) {
    console.log(ctx.request.query);
    const user = await getRepository(User)
    .findOne({email: ctx.request.query.email},{
      relations:['notes','notes.category']
    });
    if(!user){
      return new HttpResponseBadRequest();
    }
    return new HttpResponseOK({
      user:user.email,
      notes:user.notes
    });
  }
}
