import {Router, Request, Response, NextFunction} from 'express';

import * as auth from '../../auth/auth.service';
import config from '../../config';
import User from '../../models/user';
import BaseCtrl from '../base';

import { userRequest } from "../../config/definitions";

export class ProfileRouter extends BaseCtrl{
  router: Router
  model = User;

  constructor() {
    super();
    this.router = Router();
    this.routes();
  }

  public profile = (req: userRequest, res: Response) =>  {
    
    const params = req.params;

    return User.findOne({ username: params.username }).exec()
        .then(user => {
            if(!user) {
                throw new Error('Profile not found');
            }

            return res.json({user});
        })
        .catch(this.validationError(res, 401));
  }

  routes() {
    this.router.get('/:username', this.profile);
  }

}

const router = new ProfileRouter().router;
export default router;