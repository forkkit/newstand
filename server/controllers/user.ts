import * as jwt from 'jsonwebtoken';

import config from '../config';
import User from '../models/user';
import BaseCtrl from './base';

export default class UserCtrl extends BaseCtrl {
  model = User;

  create = (req, res) => {
    let user = new this.model(req.body);
    user.provider = 'local';

    user.save()
      .then(user => {

        const token = jwt.sign({ _id: user._id }, config.secrets.session, {
          expiresIn: 60 * 60 * 5
        });

        res.json({token: token, userId: user._id });
      })
      .catch(err => console.log(err));

  }

}
