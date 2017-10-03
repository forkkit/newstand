import * as passport from 'passport';
import {Strategy as GoogleStrategy} from 'passport-google-oauth20';

import * as auth from '../../auth/auth.service';

export class Google {

  public googleAuthenticate(User, profile, done) {

    //Hack to change image size
    //Ref https://stackoverflow.com/questions/14020985/retrieving-profile-image-from-google-api
    const photo = profile.photos[0].value;
    const photoPath = photo.substr(0,photo.indexOf('?sz=')) + '?sz=200';

    User.findOne({'google.id': profile.id}).exec()
    .then(user => {
      if(user) {
        return done(null, user);
      }
    })
    .then(auth.setupProfile(profile.emails[0].value, photoPath))
    .then(local_profile => {
      
      const user = new User({
        email: profile.emails[0].value,
        role: 'user',
        provider: 'google',
        profile: local_profile,
        google: profile._json
      });
      user.save()
        .then(savedUser => done(null, savedUser))
        .catch(err => done(err));

    })
    .catch(err => done(err));

  }

  public setup(User, config) {

    passport.use(new GoogleStrategy({
        clientID: config.google.clientID,
        clientSecret: config.google.clientSecret,
        callbackURL: config.google.callbackURL
    }, (accessToken, refreshToken, profile, done) => {
      return this.googleAuthenticate(User, profile, done);
    }));

  }

}