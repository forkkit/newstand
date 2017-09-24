import * as passport from 'passport';
import {setTokenCookie} from '../auth.service';
import {Router, Request, Response, NextFunction} from 'express';

export class GoogleStrategy {
  router: Router

  constructor() {
    this.router = Router();
    this.routes();
  }

  routes() {
    this.router.get('/', passport.authenticate('google', {
        scope: ['profile', 'email'],
        failureRedirect: '/signup',
        session: false
      }));

    this.router.get('/callback', passport.authenticate('google', {
        failureRedirect: '/signup',
        session: false
      }), setTokenCookie);

  }

}

const googleStrategy = new GoogleStrategy().router;
export default googleStrategy;