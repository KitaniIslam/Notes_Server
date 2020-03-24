// 3p
import {
  Context, dependency, HttpResponseNoContent, Post,
  Session, TokenRequired, ValidateBody, verifyPassword , HttpResponseOK , HttpResponseUnauthorized , hashPassword
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
  // Validate the request body.
  @ValidateBody(credentialsSchema)
  async login(ctx: Context) {
    console.log('you hit login');
    const user = await getRepository(User).findOne({ email: ctx.request.body.email });

    if (!user) {
      return new HttpResponseUnauthorized();
    }

    if (!await verifyPassword(ctx.request.body.password, user.password)) {
      return new HttpResponseUnauthorized();
    }

    // Create a session associated with the user.
    const session = await this.store.createAndSaveSessionFromUser(user);

    // Redirect the user to the home page on success.
    return new HttpResponseOK({
      token: session.getToken()
    });
    }

  @Post('/logout')
  @TokenRequired({ store: TypeORMStore, extendLifeTimeOrUpdate: false })
  async logout(ctx: Context<any, Session>) {
    await this.store.destroy(ctx.session.sessionID);
    return new HttpResponseNoContent();
  }
}