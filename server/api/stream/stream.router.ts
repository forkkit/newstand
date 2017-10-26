import {Router, Request, Response, NextFunction} from 'express';
import * as stream_node from 'getstream-node';

import * as auth from '../../auth/auth.service';
import config from '../../config';
import Profile from '../../models/profile';
import Stream from '../../models/stream';
import BaseCtrl from '../base';

import { userRequest } from "../../config/definitions";

export class StreamRouter extends BaseCtrl{
  router: Router
  model = Profile;
  FeedManager = stream_node.FeedManager;
  StreamMongoose = stream_node.mongoose;
  StreamBackend = new this.StreamMongoose.Backend();

  constructor() {
    super();
    this.router = Router();
    this.routes();  
  }

  public enrichActivities = (body) => {
    const activities = body.results;
    return this.StreamBackend.enrichActivities(activities);
  }

  public feed = (req: userRequest, res: Response) =>  {
    
    let feed; 

    if(req.profile._id.equals(req.params.id)){
      feed = this.FeedManager.getUserFeed(req.params.id)
    }else{
      feed = this.FeedManager.getNewsFeeds(req.params.id)['timeline']; 
    }

     return feed
      .get({})
      .then(this.enrichActivities)
      .then(this.respondWithResult(res))
      .catch(this.validationError(res))
    
  }

  public follow = (req: userRequest, res: Response) =>  {

    const user = req.profile._id;
    
     return this.model.findById(req.body.target).exec()
      .then((target)=>{

        const follow = new Stream.Follow({
          user: user,
          target: target._id
        });

        return follow.save()
          .then(this.respondWithResult(res))
          .catch((err) => { throw err;  })

      })
      .catch(this.validationError(res))
    
  }


  private notifications = (req: userRequest, res: Response) =>  {

    const notificationFeed = this.FeedManager.getNotificationFeed(req.profile._id);
      
    return notificationFeed
      .get({ mark_read: true, mark_seen: true })
      .then((body)=>{
        const activities = body.results;
        if (activities.length == 0) {
          return null;
        } else {
          req.user.unseen = 0;
          return this.StreamBackend.enrichActivities(activities[0].activities);
        }
      })
      .then(this.respondWithResult(res))
      .catch(this.validationError(res))
    
  }

  routes() {
    this.router.get('/feed/:id', auth.isAuthenticated(), this.feed);
    this.router.post('/follow', auth.isAuthenticated(), this.follow);
    this.router.get('/notifications', auth.isAuthenticated(), this.notifications);
  }

}

const router = new StreamRouter().router;
export default router;