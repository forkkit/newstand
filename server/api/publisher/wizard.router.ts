import {Router, Request, Response, NextFunction} from 'express';

import { stringScraper } from 'string-scraper';
import * as shortid from 'shortid';

import * as auth from '../../auth/auth.service';
import Profile from '../../models/profile';
import User from '../../models/user';
import Stream from '../../models/stream';
import BaseCtrl from '../base';
import config from '../../config';
import { userRequest } from "../../config/definitions";

export class WizardRouter extends BaseCtrl{
  router: Router
  model = Profile;
  user = User;

  constructor() {
    super();
    this.router = Router();
    this.routes();
  }

  private setup = (req: Request, res: Response) =>  {
    
    const obj = new this.model(req.body);

    obj.publisher.id = shortid.generate();
    
    obj.save()
      .then(this.respondWithResult(res))
      .catch(this.validationError(res));
    
    }

  private updateSetup = (req: Request, res: Response) =>  {
    
    const data = req.body;

    return this.model.findById(req.params.id).exec()
        .then(profile=>{
        
        if(!profile){
            throw 'Publication not found!';
        }

        profile.name = data.name;
        profile.username = data.username;
        profile.publisher.domain = data.publisher.domain;
        profile.bio = data.bio;

        return profile.save()
            .then(this.respondWithResult(res))
            .catch(err => {throw err});

        })
        .catch(this.validationError(res))
    
    }

  private findMember = (req: Request, res: Response) =>  {

    return this.user.findOne({'email':req.params.email}).exec()
        .then((user)=>{

            if(!user){
                throw 'User not found with email provided';
            }

            return this.model.findOne({'user.object':user._id}).exec()
                .then(this.respondWithResult(res))
                .catch(err => {throw err});

        })
        .catch(this.validationError(res));

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

        profile.publisher.members = req.body.members;

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

        const domains = req.body;       
                 
        return this.model.findById(req.params.id).exec()
            .then(profile => {

                profile.publisher = domains;
                profile.publisher.status = 2;
                
                return profile.save()
                    .then(this.respondWithResult(res))
                    .catch(err => {throw err});
            })
            .catch(this.validationError(res));


    }

    public verifySegment = (req: Request, res: Response) =>  {
        
        const data = req.body;

        //Allow full access to Boston.com for testing
        const identifier = (data.profile.domain === 'boston.com') ? 'article' : '.ce-'+data.profile.id;
        
        return stringScraper(data.url, data.section, identifier, 20, false)
        .then(this.respondWithResult(res))
        .catch(this.handleError(res));
        
    }

    public complete = (req: Request, res: Response) =>  {
        
        const data = req.body;

        this.model.findOneAndUpdate(data, {$set:{'status': 'active', 'publisher.status': 2}}).exec()
            .then(this.respondWithResult(res))
            .catch(this.handleError(res));
        
    }

  
  
  routes() {
    this.router.post('/setup', auth.isAuthenticated(), this.setup);
    this.router.post('/setup/:id', auth.isAuthenticated(), this.updateSetup);
    this.router.get('/members/:email', auth.isAuthenticated(), this.findMember);
    this.router.put('/members/:id', auth.isAuthenticated(), this.members);
    this.router.put('/details/:id', auth.isAuthenticated(), this.details);
    this.router.post('/segment', auth.isAuthenticated(), this.verifySegment);
    this.router.put('/verify', auth.isAuthenticated(), this.complete);
    this.router.get('/:id', this.get);
  }

}

const router = new WizardRouter().router;
export default router;