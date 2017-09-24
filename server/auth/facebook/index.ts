import * as passport from 'passport';
import {setTokenCookie} from '../auth.service';
import {Router, Request, Response, NextFunction} from 'express';

export class FBStrategy {
  router: Router

  constructor() {
    this.router = Router();
    this.routes();
  }

  routes() {
    this.router.get('/', passport.authenticate('facebook', {
        scope: ['email'],
        failureRedirect: '/signup',
        session: false
      }));

    this.router.get('/callback', passport.authenticate('facebook', {
        failureRedirect: '/signup',
        session: false
      }), setTokenCookie);

  }

}

const fbStrategy = new FBStrategy().router;
export default fbStrategy;