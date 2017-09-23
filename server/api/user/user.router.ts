import {Router, Request, Response, NextFunction} from 'express';
import * as jwt from 'jsonwebtoken';

import config from '../../config';
import User from '../../models/user';

export class UserRouter {
  router: Router

  constructor() {
    this.router = Router();
    this.routes();
  }

  private validationError(res: any, statusCode?:number) {
    statusCode = statusCode || 500;
    return function(err) {
      return res.status(statusCode).send(err);
    };
  }


  public create = (req: Request, res: Response) =>  {
    
    const newUser = new User(req.body);
    newUser.provider = 'local';
    newUser.save()
    .then(function(user) {

      const payload = {
        _id: user._id,
        role: user.role, 
        username: user.username
      }

      const token = jwt.sign({ user: payload }, config.secrets.session, {
        expiresIn: 60 * 60 * 5
      });

      res.json({ token });
    })
    .catch(this.validationError(res, undefined));


  }

  routes() {
    this.router.post('/create', this.create);
  }

}

const router = new UserRouter().router;
export default router;