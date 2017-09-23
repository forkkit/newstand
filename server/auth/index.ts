import * as express from 'express';

import config from '../config';
import User from '../models/user';
import { Local } from './local/passport';
import UserRouter from './local';

export class AuthRouter {
  
  public express: express.Application;

  constructor() {
    this.express = express();
    this.routes();
    new Local().setup(User);
  }

  private routes(): void {
    this.express.use('/local', UserRouter);
  }

}

export default new AuthRouter().express;
