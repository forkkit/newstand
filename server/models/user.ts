import * as mongoose from 'mongoose';
import * as crypto from 'crypto';

const authTypes = ['facebook', 'google'];

const userSchema = new mongoose.Schema({
  username: String,
  email: {
    type: String,
    lowercase: true,
    required() {
      if(authTypes.indexOf(this.provider) === -1) {
        return true;
      } else {
        return false;
      }
    }
  },
  role: {
    type: String,
    default: 'user'
  },
  password: {
    type: String,
    required() {
      if(authTypes.indexOf(this.provider) === -1) {
        return true;
      } else {
        return false;
      }
    }
  },
  status: {
    type: String,
    default: 'pending'
  },
  provider: String,
  salt: String,
  facebook: {},
  google: {},
});

/**
 * Virtuals
 */

// Public profile information
userSchema
.virtual('profile')
.get(function() {
  return {
    name: this.name,
    role: this.role
  };
});

// Non-sensitive info we'll be putting in the token
userSchema
.virtual('token')
.get(function() {
  return {
    _id: this._id,
    role: this.role
  };
});

/**
 * Validations
 */

// Validate empty email
userSchema
.path('email')
.validate(function(email) {
  if(authTypes.indexOf(this.provider) !== -1) {
    return true;
  }
  return email.length;
}, 'Email cannot be blank');

// Validate empty password
userSchema
.path('password')
.validate(function(password) {
  if(authTypes.indexOf(this.provider) !== -1) {
    return true;
  }
  return password.length;
}, 'Password cannot be blank');

// Validate email is not taken
userSchema
.path('email')
.validate(function(value, respond) {
  if(authTypes.indexOf(this.provider) !== -1) {
    return respond(true);
  }

  return this.constructor.findOne({ email: value }).exec()
    .then(user => {
      if(user) {
        if(this.id === user.id) {
          return respond(true);
        }
        return respond(false);
      }
      return respond(true);
    })
    .catch(function(err) {
      throw err;
    });
}, 'The specified email address is already in use.');



var validatePresenceOf = function(value) {
  return value && value.length;
};

/**
 * Pre-save hook
 */
userSchema
.pre('save', function(next) {
  
  const emailName = this.email.split('@')[0];
  this.setUsername(emailName, (username, err) => {

    this.username = username;
   
    // Handle new/update passwords
    if(!this.isModified('password')) {
      return next();
    }

    if(!validatePresenceOf(this.password)) {
      if(authTypes.indexOf(this.provider) === -1) {
        return next(new Error('Invalid password'));
      } else {
        return next();
      }
    }



    // Make salt with a callback
    this.makeSalt((saltErr, salt) => {
      if(saltErr) {
        return next(saltErr);
      }
      this.salt = salt;
      this.encryptPassword(this.password, (encryptErr, hashedPassword) => {
        if(encryptErr) {
          return next(encryptErr);
        }
        this.password = hashedPassword;
        return next();
      });
    });
  });
});

/**
 * Methods
 */
userSchema.methods = {
  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} password
   * @param {Function} callback
   * @return {Boolean}
   * @api public
   */
  authenticate(password, callback) {
    if(!callback) {
      return this.password === this.encryptPassword(password);
    }

    this.encryptPassword(password, (err, pwdGen) => {
      if(err) {
        return callback(err);
      }

      if(this.password === pwdGen) {
        return callback(null, true);
      } else {
        return callback(null, false);
      }
    });
  },

    /**
   * Check username availability
   *
   * @param {String} value
   * @param {Function} callback
   * @return {Boolean}
   * @api public
   */
  usernameCheck(value, callback) {

    return this.constructor.findOne({ username: value }).exec()
    .then(user => {
      if(user) {
        if(this.id === user.id) {
          return callback(true);
        }
        return callback(false);
      }
      return callback(true);
    })
    .catch(function(err) {
      throw err;
    });
    
  },

    /**
   * Set unique initial username
   *
   * @param {String} value
   * @param {Function} callback
   * @return {Boolean}
   * @api public
   */
  setUsername(value, callback) {
  
    let that = this;
    let checkWrap = function(username:string):string {

      return that.usernameCheck(username, (available, err) => {
                  
        //Proposed username is available
        if(available){
          return callback(username);
        }
  
        //Else, find one that is
        const dashIndex = username.lastIndexOf('-');
        const digit= ~~(username.substring(dashIndex  + 1));
        if(digit){
          const newUsername = username.substring(0, dashIndex) + '-' + (digit + 1);
          checkWrap(newUsername);
          return;
        }

        checkWrap(username + '-1');
        return;
      });

    }

    checkWrap(value); 

  },

  /**
   * Make salt
   *
   * @param {Number} [byteSize] - Optional salt byte size, default to 16
   * @param {Function} callback
   * @return {String}
   * @api public
   */
  makeSalt(...args) {
    let byteSize;
    let callback;
    let defaultByteSize = 16;

    if(typeof args[0] === 'function') {
      callback = args[0];
      byteSize = defaultByteSize;
    } else if(typeof args[1] === 'function') {
      callback = args[1];
    } else {
      throw new Error('Missing Callback');
    }

    if(!byteSize) {
      byteSize = defaultByteSize;
    }

    return crypto.randomBytes(byteSize, (err, salt) => {
      if(err) {
        return callback(err);
      } else {
        return callback(null, salt.toString('base64'));
      }
    });
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @param {Function} callback
   * @return {String}
   * @api public
   */
  encryptPassword(password, callback) {
    if(!password || !this.salt) {
      if(!callback) {
        return null;
      } else {
        return callback('Missing password or salt');
      }
    }

    var defaultIterations = 10000;
    var defaultKeyLength = 64;
    var salt = new Buffer(this.salt, 'base64');

    if(!callback) {
      // eslint-disable-next-line no-sync
      return crypto.pbkdf2Sync(password, salt, defaultIterations,
          defaultKeyLength, 'sha1')
        .toString('base64');
    }

    return crypto.pbkdf2(password, salt, defaultIterations, defaultKeyLength,
      'sha1', (err, key) => {
        if(err) {
          return callback(err);
        } else {
          return callback(null, key.toString('base64'));
        }
      });
  }
};

// Omit the password when returning a user
userSchema.set('toJSON', {
  transform: function(doc, ret, options) {
    delete ret.password;
    return ret;
  }
});

const User = mongoose.model('User', userSchema);

export default User;
