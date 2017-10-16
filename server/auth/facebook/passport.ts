import * as passport from 'passport';
import {Strategy as FacebookStrategy} from 'passport-facebook';

import * as auth from '../../auth/auth.service';

export class Facebook {

  public fbAuthenticate(User, Profile, profile, done) {

    User.findOne({'facebook.id': profile.id}).exec()
      .then(user => {

        if(user){
          return Profile.findOne({'user.object': user._id}).exec()
            .then(result => {
              return done(null, result);
            })
            .catch(err => {throw err});
        }

        const newUser = new User({
          email: profile.emails[0].value,
          role: 'user',
          provider: 'facebook',
          facebook: profile._json
        });

        newUser.save()
          .then(auth.userProfile(profile.photos[0].value))
          .then(profile => done(null, profile))
          .catch(err => done(err));
      })
      .catch(err => done(err));

  }

  public setup(User:any, Profile:any, config) {

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
      return this.fbAuthenticate(User, Profile, profile, done);
    }));

  }

}