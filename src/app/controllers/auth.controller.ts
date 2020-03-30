// 3p
import {
  Context, dependency, Post,Get,
  Session, TokenRequired, ValidateBody, verifyPassword , HttpResponseOK , HttpResponseUnauthorized , hashPassword, HttpResponseNotFound
} from '@foal/core';
import { TypeORMStore } from '@foal/typeorm';
import { getRepository } from 'typeorm';

import { User } from '../entities';

const credentialsSchema = {
  additionalProperties: false,
  properties: {
      email: { type: 'string', format: 'email' },
      password: { type: 'string' }
  },
  required: ['email', 'password'],
  type: 'object',
}

export class AuthController {
  @dependency
  store: TypeORMStore;

  @Post('/signup')
  @ValidateBody(credentialsSchema)
  async signup(ctx: Context){
    const user = new User();
    user.email = ctx.request.body.email;
    user.password = await hashPassword(ctx.request.body.password);
    await getRepository(User).save(user);

    const session = await this.store.createAndSaveSessionFromUser(user);
    return new HttpResponseOK({
      token: session.getToken()
    });
  }

  @Post('/login')
  @ValidateBody(credentialsSchema)
  async login(ctx: Context) {
    const user = await getRepository(User).findOne({ email: ctx.request.body.email });

    if (!user) {
      return new HttpResponseUnauthorized();
    }

    if (!await verifyPassword(ctx.request.body.password, user.password)) {
      return new HttpResponseUnauthorized();
    }

    const session = await this.store.createAndSaveSessionFromUser(user);

    return new HttpResponseOK({
      token: session.getToken()
    });
    }

  @Post('/logout')
  @TokenRequired({ store: TypeORMStore, extendLifeTimeOrUpdate: false })
  async logout(ctx: Context<any, Session>) {
    await this.store.destroy(ctx.session.sessionID);
    return new HttpResponseOK();
  }

  @Get('/user')
  @TokenRequired({ store: TypeORMStore, extendLifeTimeOrUpdate: false })
  async user(ctx: Context){

    const user = await getRepository(User).findOne(ctx.user,{
      relations: ['notes', 'notes.category']
    });

    if(!user){
      return new HttpResponseNotFound();
    }
    return new HttpResponseOK({
      id: user.id,
      email: user.email,
      notes: user.notes
    });
  }
}