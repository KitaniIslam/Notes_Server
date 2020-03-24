import { Context, Get, HttpResponseOK , TokenRequired , HttpResponseNotFound } from '@foal/core';
import { TypeORMStore } from '@foal/typeorm';
import {User} from '../entities/user.entity';
import { getRepository } from 'typeorm';

@TokenRequired({ store: TypeORMStore })
export class ApiController {

  @Get('/notes')
  async index(ctx: Context) {
    const notes = await getRepository(User).findOne({email: ctx.request.body.email});
    if(!notes){
      return new HttpResponseNotFound();
    }
    // TODO: join notes and category tables and return them
    return new HttpResponseOK(notes.email);
  }

}
