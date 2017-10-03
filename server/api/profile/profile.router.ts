import {Router, Request, Response, NextFunction} from 'express';

import * as auth from '../../auth/auth.service';
import config from '../../config';
import Profile from '../../models/profile';
import BaseCtrl from '../base';

import { userRequest } from "../../config/definitions";

export class ProfileRouter extends BaseCtrl{
  router: Router
  model = Profile;

  constructor() {
    super();
    this.router = Router();
    this.routes();
  }

  public profile = (req: userRequest, res: Response) =>  {
    
    const params = req.params;

    return this.model.findOne({ username: params.username }).exec()
        .then(profile => {
            if(!profile) {
                throw new Error('Profile not found');
            }

            return res.json({profile});
        })
        .catch(this.validationError(res, 401));
  }

  public username = (req: Request, res: Response) =>  {
    
    const user = req.user;
    const username = req.body.profile.username;
    
    return this.model.findById(user.profile).exec()
      .then(profile => {

        if(!profile){
          throw new Error('Profile not found');
        }

        profile.username = username;
        profile.type = 'user';
        profile.status = 'active';
        return profile.save()
          .then(result => {

            user.profile = result;
            return res.json({user});

          })
          .catch(err => {throw err});

      })
      .catch(this.validationError(res))  
    
  }

  routes() {
    this.router.get('/:username', this.profile);
    this.router.put('/username', auth.isAuthenticated(), this.username);
  }

}

const router = new ProfileRouter().router;
export default router;