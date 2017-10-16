import {Router, Request, Response, NextFunction} from 'express';
import { stringScraper } from 'string-scraper';

import * as auth from '../../auth/auth.service';
import config from '../../config';
import Profile from '../../models/profile';
import BaseCtrl from '../base';
import Publisher from '../../models/publisher';
import Label from '../../models/label';

import { userRequest } from "../../config/definitions";

export class LabelRouter extends BaseCtrl{
  router: Router
  model = Profile;
  publisher = Publisher;
  label = Label;

  constructor() {
    super();
    this.router = Router();
    this.routes();
  }

  public searchByDomain = (req: Request, res: Response) =>  {

    return this.publisher.findOne({ "domain": { "$regex": req.body.url, "$options": "i" } }).exec()
      .then((result) => {

        if(!result){
          res.json({error: 'not_found', domain: req.body.url});
        }
        
        return this.model.findOne({'publisher.object': result._id}).exec()
          .then(this.respondWithResult(res))
          .catch((err) => { throw err; });

      })
      .catch(this.validationError(res))

  }

  public verifySection = (req: Request, res: Response) =>  {

    const data = req.body;
    
    return stringScraper(data.url, data.section, 20)
    .then((result) => {
      return res.json({valid:result})
    })
    .catch(this.validationError(res));

  }

  public create = (req: userRequest, res: Response) =>  {
    
    const data = new Label(req.body);
    data.user.username = req.profile.username;
    data.user.profile = req.profile._id;

    data.save()
      .then(this.respondWithResult(res))
      .catch(this.validationError(res));
    
  }

  routes() {
    this.router.post('/domain', auth.isAuthenticated(), this.searchByDomain);
    this.router.post('/section', auth.isAuthenticated(), this.verifySection);
    this.router.post('/create', auth.isAuthenticated(), this.create);
  }

}

const router = new LabelRouter().router;
export default router;