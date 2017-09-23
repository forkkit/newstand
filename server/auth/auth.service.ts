import * as jwt from 'jsonwebtoken';

import config from '../config';


/**
 * Returns a jwt token signed by the app secret
 */
export function signToken(id, role, username) {
    return jwt.sign({user: {_id: id, role, username }}, config.secrets.session, {
      expiresIn: "7d"
    });
  }