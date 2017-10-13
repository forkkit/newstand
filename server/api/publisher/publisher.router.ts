import {Router, Request, Response, NextFunction} from 'express';

import * as auth from '../../auth/auth.service';
import config from '../../config';
import Publisher from '../../models/publisher';
import Profile from '../../models/profile';
import BaseCtrl from '../base';


export class PublisherRouter extends BaseCtrl{
  router: Router
  model = Publisher;

  constructor() {
    super();
    this.router = Router();
    this.routes();
  }

  public publisher = (req: Request, res: Response) =>  {
    
    return this.model.findById(req.params.id).populate('profile').exec()
      .then(publisher => {
        return res.json(publisher);
      })
      .catch(this.validationError(res))
  }
  

  public getByProfile = (req: Request, res: Response) =>  {

    return this.model.findOne({profile:req.params.id}).exec()
      .then(publisher=>{
        return res.json({publisher});
      })
      .catch(this.validationError(res))
  }

  public getByUser = (req: Request, res: Response) =>  {
    
    return this.model.find({'members.profile':req.params.id}).populate('profile').exec()
      .then(this.respondWithResult(res))
      .catch(this.validationError(res))
  }
  
  routes() {
    this.router.get('/profile/:id', this.getByProfile);
    this.router.get('/user/:id', this.getByUser);
    this.router.get('/:id', this.publisher);
  }

}

const router = new PublisherRouter().router;
export default router;