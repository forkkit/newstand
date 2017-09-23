import * as passport from 'passport';
import {signToken} from '../auth.service';
import {Router, Request, Response, NextFunction} from 'express';

export class LocalStrategy {
  router: Router

  constructor() {
    this.router = Router();
    this.routes();
  }

  public passport(req: Request, res: Response, next: NextFunction) {
    
    passport.authenticate('local', function(err, user, info) {
      var error = err || info;
      if(error) {
        return res.status(401).json(error);
      }
      if(!user) {
        return res.status(404).json({message: 'Something went wrong, please try again.'});
      }
  
      var token = signToken(user._id, user.role, user.username);
      res.json({ token });
    })(req, res, next);

  }

  routes() {
    this.router.post('/', this.passport);
  }

}

const localStrategy = new LocalStrategy().router;
export default localStrategy;