import * as passport from 'passport';
import {Strategy as LocalStrategy} from 'passport-local';

export class Local {

  public localAuthenticate(User, email, password, done) {
    
    User.findOne({
      email: email.toLowerCase()
    }).populate('profile').exec()
      .then(user => {
        if(!user) {
          return done(null, false, {
            message: 'This email is not registered.'
          });
        }
        user.authenticate(password, function(authError, authenticated) {
          if(authError) {
            return done(authError);
          }
          if(!authenticated) {
            return done(null, false, { message: 'This password is not correct.' });
          } else {
            return done(null, user);
          }
        });
      })
      .catch(err => done(err));

  }

  public setup(User:any/*, Profile, config*/) {

    passport.use(new LocalStrategy({ 
      usernameField: 'email',
      passwordField: 'password'  
    }, (email, password, done) => {
      return this.localAuthenticate(User, email, password, done);
    }));

  }

}