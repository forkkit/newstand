import {Router, Request, Response, NextFunction} from 'express';

import * as auth from '../../auth/auth.service';
import config from '../../config';
import Profile from '../../models/profile';
import BaseCtrl from '../base';
import Stream from '../../models/stream';

import { userRequest } from "../../config/definitions";

export class ProfileRouter extends BaseCtrl{
  router: Router
  model = Profile;
  stream = Stream;

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
    const user = req.profile;
    

    return this.model.findOne({ username: params.username }).exec()
        .then(profile => {
            
          if(!profile) {
            throw new Error('Profile not found');
          }

          if(!user){
            return profile;
          }

          //User owns profile page
          if(user._id.equals(profile._id)){
            profile.role = 'owner';
            return profile;
          }

          const members = profile.publisher.members;

          for(let i=0; i<members.length; i++){
            if(members[i].profile.equals(user._id)){
              profile.role = members[i].role;
            }
          }

          return this.stream.Follow.find({user:user._id, target: profile._id}).exec()
            .then((follow)=>{

              const is = follow.length>0 ? true : false;

              profile.set('follow', is);

              return profile;

            });

        })
        .then(this.respondWithResult(res))
        .catch(this.validationError(res, 401));
  }

  public username = (req: userRequest, res: Response) =>  {
    
    const user = req.profile; 
    const update = req.body;
    
    return this.model.findById(user._id).exec()
      .then(profile => {

        if(!profile){
          throw new Error('Profile not found');
        }

        profile.username = update.username;
        profile.image = update.image;
        profile.bio = update.bio;
        profile.type = 'user';
        profile.status = 'active';
        return profile.save()
          .then(this.respondWithResult(res))
          .catch(err => {throw err});

      })
      .catch(this.validationError(res))  
    
  }

  routes() {

    this.router.get('/username/:username', auth.checkAuth(), this.profile);
    this.router.put('/username', auth.isAuthenticated(), this.username);
    this.router.put('/:id', auth.isAuthenticated(), this.update);
    this.router.get('/', auth.isAuthenticated(), this.index)
    this.router.get('/:id', auth.checkAuth(), this.get);
    this.router.post('/', this.insert);

  }

}

const router = new ProfileRouter().router;
export default router;