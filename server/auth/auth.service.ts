import * as jwt from 'jsonwebtoken';
import * as expressJwt from 'express-jwt';
import * as compose from 'composable-middleware';
import * as stream_node from 'getstream-node';

import _ from 'lodash';

import User from '../models/user';
import Profile from '../models/profile';
import config from '../config';

const validateJwt = expressJwt({
  secret: config.secrets.session
});

const FeedManager = stream_node.FeedManager;

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
 * Check if the user is auth with no redirects
 */
export function checkAuth() {
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

      let token  = req.headers.authorization;
      token = token.replace(new RegExp('Bearer ', 'g'), '');
      
      if(token === 'undefined'){
        return next();
      }
      
      validateJwt(req, res, next);
    })
    // Attach user to request
    .use(function(req, res, next) {
      
      if(!req.user){
        return next();
      }

      Profile.findById(req.user._id).exec()
        .then(profile => {

          req.profile = profile;          
          next();

        })
        .catch(err => next(err));
    });
}

/**
 * Setup initial user profile upon account creation
 */
export function userProfile(image?: string) {
  return function(user){

    let generateUsername = function(username:string) { 

      return Profile.findOne({ username: username }).exec().
        then(has => {

          //If available
          if(!has){
            let profile = new Profile({
              username: username,
              image: image,
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
 * Get stream activity for user
 */
export function stream() {
  return compose()
    .use(function(req, res, next) {
      
      const notificationFeed = FeedManager.getNotificationFeed(req.profile._id);

      return notificationFeed.get({ limit: 0 }).then(function(body) {
        if (typeof body !== 'undefined')
          req.profile.unseen = body.unseen;
        next();
      })
      .catch(err => next(err));

    });
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