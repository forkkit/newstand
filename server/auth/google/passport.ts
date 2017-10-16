import * as passport from 'passport';
import {Strategy as GoogleStrategy} from 'passport-google-oauth20';

import * as auth from '../../auth/auth.service';

export class Google {

  public googleAuthenticate(User, Profile, profile, done) {

    //Hack to change image size
    //Ref https://stackoverflow.com/questions/14020985/retrieving-profile-image-from-google-api
    const photo = profile.photos[0].value;
    const photoPath = photo.substr(0,photo.indexOf('?sz=')) + '?sz=200';

    User.findOne({'google.id': profile.id}).exec()
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
          provider: 'google',
          google: profile._json
        });
        
        newUser.save()
          .then(auth.userProfile(photoPath))
          .then(profile => done(null, profile))
          .catch(err => done(err));

      })
      .catch(err => done(err));

  }

  public setup(User:any, Profile:any, config) {

    passport.use(new GoogleStrategy({
        clientID: config.google.clientID,
        clientSecret: config.google.clientSecret,
        callbackURL: config.google.callbackURL
    }, (accessToken, refreshToken, profile, done) => {
      return this.googleAuthenticate(User, Profile, profile, done);
    }));

  }

}