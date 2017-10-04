import * as passport from 'passport';
import {Strategy as FacebookStrategy} from 'passport-facebook';

import * as auth from '../../auth/auth.service';

export class Facebook {

  public fbAuthenticate(User, profile, done) {

    User.findOne({'facebook.id': profile.id}).exec()
    .then(auth.setupProfile(profile.emails[0].value, profile.photos[0].value))
    .then(result => {

      if(result.user){
        return done(null, result.user);
      }

      const user = new User({
        email: profile.emails[0].value,
        role: 'user',
        provider: 'facebook',
        profile: result.profile,
        facebook: profile._json
      });

      user.save()
        .then(savedUser => done(null, savedUser))
        .catch(err => done(err));
    })
    .catch(err => done(err));

  }

  public setup(User, config) {

    passport.use(new FacebookStrategy({
        clientID: config.facebook.clientID,
        clientSecret: config.facebook.clientSecret,
        callbackURL: config.facebook.callbackURL,
        profileFields: [
          'displayName',
          'emails',
          'picture.type(large)'
        ] 
    }, (accessToken, refreshToken, profile, done) => {
      return this.fbAuthenticate(User, profile, done);
    }));

  }

}