import {Router, Request, Response, NextFunction} from 'express';
import * as jwt from 'jsonwebtoken';

import * as auth from '../../auth/auth.service';
import config from '../../config';
import User from '../../models/user';
import BaseCtrl from '../base';

import { userRequest } from "../../config/definitions";

export class UserRouter extends BaseCtrl{
  router: Router
  model = User;

  constructor() {
    super();
    this.router = Router();
    this.routes();
  }

  public me = (req: userRequest, res: Response) =>  {
    
    const userId = req.user._id;
    const token = req.token;
    
    return User.findOne({ _id: userId }).populate('profile').exec()
      .then(user => {
        if(!user) {
          return res.status(401).end();
        }

        return res.json({token, user});
      })
      .catch(err => console.log(err));
  }


  public create = (req: Request, res: Response) =>  {
    
    const newUser = new this.model(req.body);

    return User.findOne({email:newUser.email}).exec()
      .then(user => {
        //Check that email is available
        if(user){
          throw new Error('The E-mail address you entered is already associated with an account.');
        }
        return;
      })
      .then(auth.setupProfile(newUser.email))
      .then(profile => {

        newUser.profile = profile;
        newUser.provider = 'local';

        return newUser.save()
          .then(function(user) {
            const token = auth.signToken(user._id, user.role);
            return res.json({ token, user });
          })
          .catch(err => {throw err; });

        
      })
      .catch(this.validationError(res));

  }

  routes() {
    this.router.post('/create', this.create);
    this.router.get('/me', auth.isAuthenticated(), this.me);
  }

}

const router = new UserRouter().router;
export default router;