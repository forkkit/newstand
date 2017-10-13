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

  public index = (req: userRequest, res: Response) =>  {
    
    this.model.find({'publisher.members.profile': req.profile._id}).exec()
      .then(this.respondWithResult(res))
      .catch(this.validationError(res))

  }

  public profile = (req: userRequest, res: Response) =>  {
    
    const params = req.params;

    return this.model.findOne({ username: params.username }).exec()
        .then(profile => {
            if(!profile) {
                throw new Error('Profile not found');
            }

            return res.json(profile);
        })
        .catch(this.validationError(res, 401));
  }

  public username = (req: userRequest, res: Response) =>  {
    
    const user = req.profile;
    const username = req.body.username;
    
    return this.model.findById(user._id).exec()
      .then(profile => {

        if(!profile){
          throw new Error('Profile not found');
        }

        profile.username = username;
        profile.type = 'user';
        profile.status = 'active';
        return profile.save()
          .then(this.respondWithResult(res))
          .catch(err => {throw err});

      })
      .catch(this.validationError(res))  
    
  }

  routes() {
    this.router.get('/username/:username', this.profile);
    this.router.put('/username', auth.isAuthenticated(), this.username);
    this.router.get('/', auth.isAuthenticated(), this.index)
    this.router.get('/:id', this.get);
    this.router.post('/', this.insert);
    this.router.put('/:id', this.update);
  }

}

const router = new ProfileRouter().router;
export default router;