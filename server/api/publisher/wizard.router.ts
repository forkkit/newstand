import {Router, Request, Response, NextFunction} from 'express';

import * as auth from '../../auth/auth.service';
import Publisher from '../../models/publisher';
import Profile from '../../models/profile';
import Stream from '../../models/stream';
import BaseCtrl from '../base';
import config from '../../config';
import { userRequest } from "../../config/definitions";

export class WizardRouter extends BaseCtrl{
  router: Router
  model = Profile;
  publisher = Publisher;

  constructor() {
    super();
    this.router = Router();
    this.routes();
  }

  private members = (req: Request, res: Response) =>  {
    
    return this.model.findById(req.params.id).exec()
        .then(profile=>{
        
        if(!profile){
            throw 'Publication not found!';
        }

        if(profile.publisher.status < 1){
            profile.publisher.status = 1;
        }

        //publisher.members = req.body.members;

        return profile.save()
            .then(this.respondWithResult(res))
            .catch(err => {throw err});

        })
        .catch(this.validationError(res))
    
    }

    private follow = function(user){
        return function(entity){

            const follow = new Stream.Follow({
                user: user._id,
                target: entity._id
            });

            return follow.save()
                .catch(err => {throw err});
        }
    }

    private details = (req: userRequest, res: Response) =>  {

        const publisher = new this.publisher(req.body);
        const user = req.profile;
        
        return publisher.save()
            .then(savedPublisher => {
                
                return this.model.findById(req.params.id).exec()
                    .then(profile => {

                        profile.publisher.object = savedPublisher._id;
                        profile.publisher.status = 2;
                        
                        return profile.save()
                            .then(this.follow(user))
                            .then(this.respondWithResult(res))
                            .catch(err => {throw err});
                    })
                    .catch(err => {throw err});

            })
            .catch(this.validationError(res));

    }

  
  
  routes() {
    this.router.get('/:id', this.get);
    this.router.post('/setup', this.insert);
    this.router.put('/members/:id', this.members);
    this.router.put('/details/:id', auth.isAuthenticated(), this.details);
  }

}

const router = new WizardRouter().router;
export default router;