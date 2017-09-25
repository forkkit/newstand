import * as passport from 'passport';
import {Strategy as FacebookStrategy} from 'passport-facebook';

export class Facebook {

  public fbAuthenticate(User, profile, done) {

    User.findOne({'facebook.id': profile.id}).exec()
    .then(user => {
      if(user) {
        return done(null, user);
      }
      
      user = new User({
        email: profile.emails[0].value,
        role: 'user',
        provider: 'facebook',
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
          'emails'
        ] 
    }, (accessToken, refreshToken, profile, done) => {
      return this.fbAuthenticate(User, profile, done);
    }));

  }

}