import { controller , Hook , Options , HttpResponseNoContent , Context } from '@foal/core';

import { ApiController, AuthController } from './controllers';

@Hook(() => response => {
  response.setHeader('Access-Control-Allow-Origin', '*');
})

export class AppController {
  subControllers = [
    controller('/api', ApiController),
    controller('/auth', AuthController)
  ];

  @Options('*')
  options(ctx: Context) {
    const response = new HttpResponseNoContent();
    response.setHeader('Access-Control-Allow-Methods', 'HEAD, GET, POST, PUT, PATCH, DELETE');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    return response;
  }

}
