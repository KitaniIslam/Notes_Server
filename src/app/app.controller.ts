import { controller , Hook , Options , HttpResponseNoContent , Context } from '@foal/core';

import { ApiController, AuthController } from './controllers';

@Hook(() => response => {
  // Every response of this controller and its sub-controllers will be added this header.
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
    // You may need to allow other headers depending on what you need.
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    return response;
  }

}
