import {Router, Request, Response, NextFunction} from 'express';
import { stringScraper } from 'string-scraper';

import * as auth from '../../auth/auth.service';
import config from '../../config';
import Profile from '../../models/profile';
import Publisher from '../../models/publisher';
import FlagDetail from '../../models/flag';
import Activity from '../../models/activity';
import Stream from '../../models/stream';
import BaseCtrl from '../base';

import { userRequest } from "../../config/definitions";

export class FlagRouter extends BaseCtrl{
  router: Router
  model = Profile;
  publisher = Publisher;
  flag = FlagDetail;
  activity = Activity;
  stream = Stream;

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
    .catch((err)=>console.log(err));

  }

  public create = (req: userRequest, res: Response) =>  {
    
    const data = new this.flag(req.body);
    data.user.username = req.profile.username;
    data.user.profile = req.profile._id;

    data.save()
      .then((flag)=>{

        const activity = new this.stream.Flag({
            user: flag.user.profile, 
            target: flag.publisher.profile,
            flag: flag._id,
            type: 'raise'
        });

        return activity.save()
          .then(()=>{

            return flag;

          })
          .catch((err) => { throw err; });

      })
      .then(this.respondWithResult(res))
      .catch(this.validationError(res));
    
  }

  private extendQuery(obj, src) {
    Object.keys(src).forEach(function(key) { obj[key] = src[key]; });
    return obj;
  }

  private buildQuery(params) { 

    if(!params){ return {}; }

    const acceptableParams = [
      'status',
      'url',
      'user',
      'label'
    ];

    //Check for non sactioned params
    for (let key in params) {
      if(acceptableParams.indexOf(key) === -1){
        return null;
      }
    }

    //Map variables that req more complex query
    if(params['user']){
      params['user.username'] = params['user'];
      delete params['user'];
    }

    return params;
  }

  private list = (req: Request, res: Response) =>  {

    const build = this.buildQuery(req.query);

    if(!build){
      return res.status(202).send({'error': 'Invalid search parameter used'});
    }

    const query = this.extendQuery({'publisher.profile': req.params.id}, build);

    return this.flag.paginate(query, { page: req.params.page, limit: 10 })
      .then((paginate)=>{

        paginate.query = req.query;

        return paginate;

      })
      .then(this.respondWithResult(res))
      .catch(this.validationError(res));

  }

  private detail = (req: Request, res: Response) =>  {
    
    return this.flag.findById(req.params.id).populate('activity.object').populate('user.profile').exec()
      .then(this.respondWithResult(res))
      .catch(this.validationError(res));

  }

  public createActivity = (req: userRequest, res: Response) =>  {
    
    const data = new this.activity(req.body);

    data.user.object = req.profile;

    return data.save()
      .then((activity)=>{

        let status = {};

        if(activity.type !== 'comment'){
          status = {status: (activity.type === 'address' ? 'address' : 'raise')}
        }

        const pushActivity = {type: activity.type, object: activity._id}

        return this.flag.findOneAndUpdate({_id: activity.flag}, { $set: status, $push: {activity: pushActivity }}).exec()
          .then((flag) => {

            const streamActivity = new this.stream.Activity({
              user: activity.user.object._id, 
              target: flag.publisher.profile,
              activity: activity._id,
              type: activity.type
            });
    
            return streamActivity.save()
              .then(()=>{ return activity })
              .catch((err) => { throw err; });

          })
          .catch((err) => { throw err; });

      })
      .then(this.respondWithResult(res))
      .catch(this.validationError(res));

  }

  routes() {
    this.router.post('/domain', auth.isAuthenticated(), this.searchByDomain);
    this.router.post('/section', auth.isAuthenticated(), this.verifySection);
    this.router.post('/create', auth.isAuthenticated(), this.create);
    this.router.get('/list/:id/:page', this.list);
    this.router.get('/detail/:id', this.detail);

    this.router.post('/activity', auth.isAuthenticated(), this.createActivity);
  }

}

const router = new FlagRouter().router;
export default router;