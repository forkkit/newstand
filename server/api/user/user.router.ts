import {Router, Request, Response, NextFunction} from 'express';
import * as jwt from 'jsonwebtoken';

import * as auth from '../../auth/auth.service';
import config from '../../config';
import User from '../../models/user';
import Profile from '../../models/profile';
import BaseCtrl from '../base';

import { userRequest } from "../../config/definitions";

export class UserRouter extends BaseCtrl{
  router: Router
  model = User;
  profile = Profile;

  constructor() {
    super();
    this.router = Router();
    this.routes();
  }

  public me = (req: userRequest, res: Response) =>  {
    
    const token = req.token;
    const user = req.profile;
    
    return this.profile.findById(req.profile._id).exec()
      .then(profile => {

        if(!profile) {
          return res.status(401).end();
        }

        profile.unseen = user.unseen; 

        return res.json({token, profile});

      })
      .catch(this.validationError(res));
  }


  public create = (req: Request, res: Response) =>  {
    
    const user = new this.model(req.body);

    user.provider = 'local';
    return user.save()
      .then(auth.userProfile('/assets/user_placeholder.jpg'))  
      .then(profile=>{

        const token = auth.signToken(profile._id);
        return res.json({ token, profile });

      }) 
      .catch(this.validationError(res));

  }

  routes() {
    this.router.post('/create', this.create);
    this.router.get('/me', auth.isAuthenticated(), auth.stream(), this.me);
    this.router.put('/:id', auth.isAuthenticated(), this.update);
  }

}

const router = new UserRouter().router;
export default router;