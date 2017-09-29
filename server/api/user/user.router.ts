import {Router, Request, Response, NextFunction} from 'express';
import * as jwt from 'jsonwebtoken';

import * as auth from '../../auth/auth.service';
import config from '../../config';
import User from '../../models/user';
import BaseCtrl from '../base';

import { userRequest } from "../../config/definitions";

export class UserRouter extends BaseCtrl{
  router: Router
  model = User;

  constructor() {
    super();
    this.router = Router();
    this.routes();
  }

  public me = (req: userRequest, res: Response) =>  {
    
    const userId = req.user._id;
    const token = req.token;
    
      return User.findOne({ _id: userId }).exec()
        .then(user => {
          if(!user) {
            return res.status(401).end();
          }

          return res.json({token, user});
        })
        .catch(err => console.log(err));
  }


  public create = (req: Request, res: Response) =>  {
    
    const newUser = new this.model(req.body);
    newUser.provider = 'local';
    newUser.save()
    .then(function(user) {

      const token = auth.signToken(user._id, user.role);

      res.json({ token, user });
    })
    .catch(this.validationError(res));

  }

  public username = (req: Request, res: Response) =>  {

    const user = req.user;
    const username = req.body.username;
    
    let that = this;
    user.usernameCheck(username, function(available, err) {
      
      if(!available){
        res.status(409).send('Username not available. Please try again.');
        return;
      }

      user.set({ 
        status: 'active',
        username: username
      });

      return user.save()
        .then(function(user) {
          return res.json({user});
        })
        .catch(err => console.log(err));
      
    });

  }

  routes() {
    this.router.post('/create', this.create);
    this.router.get('/me', auth.isAuthenticated(), this.me);
    this.router.put('/username', auth.isAuthenticated(), this.username);
  }

}

const router = new UserRouter().router;
export default router;