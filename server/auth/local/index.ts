import * as passport from 'passport';
import {signToken} from '../auth.service';
import {Router, Request, Response, NextFunction} from 'express';
import Profile from '../../models/profile';

export class LocalStrategy {
  router: Router;

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
      
      return Profile.findOne({'user.object':user._id}).exec()
        .then(profile=>{
            
          const token = signToken(profile._id);
          return res.json({token, profile});

        })
        .catch(err => console.log(err));
  
    })(req, res, next);

  }

  routes() {
    this.router.post('/', this.passport);
  }

}

const localStrategy = new LocalStrategy().router;
export default localStrategy;