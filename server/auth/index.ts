import * as express from 'express';

import config from '../config';
import User from '../models/user';
import Profile from '../models/profile';

import { Local } from './local/passport';
import { Facebook } from './facebook/passport';
import { Google } from './google/passport';

import localStrategy from './local';
import fbStrategy from './facebook';
import googleStrategy from './google';

export class AuthRouter {
  
  public express: express.Application;

  constructor() {
    this.express = express();
    this.routes();

    new Local().setup(User);
    new Facebook().setup(User, config);
    new Google().setup(User, config);
  }

  private routes(): void {
    this.express.use('/local', localStrategy);
    this.express.use('/facebook', fbStrategy);
    this.express.use('/google', googleStrategy);
  }

}

export default new AuthRouter().express;
