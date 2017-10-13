import * as jwt from 'jsonwebtoken';
import * as expressJwt from 'express-jwt';
import * as compose from 'composable-middleware';

import _ from 'lodash';

import User from '../models/user';
import Profile from '../models/profile';
import config from '../config';

const validateJwt = expressJwt({
  secret: config.secrets.session
});

/**
 * Attaches the user object to the request if authenticated
 * Otherwise returns 403
 */
export function isAuthenticated() {
  return compose()
    // Validate jwt
    .use(function(req, res, next) {
      // allow access_token to be passed through query parameter as well
      if(req.query && req.query.hasOwnProperty('access_token')) {
        req.headers.authorization = `Bearer ${req.query.access_token}`;
      }
     // IE11 forgets to set Authorization header sometimes. Pull from cookie instead.
      if(req.query && typeof req.headers.authorization === 'undefined') {
        req.headers.authorization = `Bearer ${req.cookies.token}`;
      }
      
      validateJwt(req, res, next);
    })
    // Attach user to request
    .use(function(req, res, next) {

      Profile.findById(req.user._id).exec()
        .then(profile => {

          if(!profile) {
            return res.status(401).end();
          }

          //Send back to client - eventually supporting token refresh
          var token = req.headers.authorization;
          req.token = token.replace(new RegExp('Bearer ', 'g'), '');
          req.profile = profile;
          
          next();
        })
        .catch(err => next(err));
    });
}

/**
 * Setup initial user profile upon account creation
 */
export function userProfile() {
  return function(user){
    
    let generateUsername = function(username:string) { 

      return Profile.findOne({ username: username }).exec().
        then(has => {

          //If available
          if(!has){
            let profile = new Profile({
              username: username,
              image: '/assets/user_placeholder.jpg',
              user: {
                object: user._id
              }
            });

            return profile.save()
              .catch(err=>{throw err});
          }

          //Find available
          const dashIndex = username.lastIndexOf('-');
          const digit= ~~(username.substring(dashIndex  + 1));
          if(digit){
            const newUsername = username.substring(0, dashIndex) + '-' + (digit + 1);
            return generateUsername(newUsername);
          }

          return generateUsername(username + '-1');

        })

    }

    const username = user.email.split('@')[0];
    return generateUsername(username);

  }
}


/**
 * Returns a jwt token signed by the app secret
 */
export function signToken(id) {
  return jwt.sign({ _id: id}, config.secrets.session, {
    expiresIn: "7d"
  });
}

/**
 * Set token cookie directly for oAuth strategies
 */
export function setTokenCookie(req, res) {
  if(!req.user) {
    return res.status(404).send('It looks like you aren\'t logged in, please try again.');
  }
  var token = signToken(req.user._id);
  res.cookie('token', token);
  res.redirect('/');
}