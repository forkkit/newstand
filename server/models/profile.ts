import * as mongoose from 'mongoose';

let ObjectId = mongoose.Schema.Types.ObjectId;

const profileSchema = new mongoose.Schema({
  name: String,
  username: String,
  image: String,
  bio: String, 
  status: {
    type: String,
    default: 'pending'
  },
  type : String,
  role: {
    type: String,
    default: 'user'
  },
  publisher: {
    id: String,
    public: {
      type: Boolean,
      default: true
    },
    status: {
      type: Number, 
      default: 0
    },
    domain: String,
    subdomains: [],
    members:[{
      username: String,
      role: String,
      profile: {
        type: ObjectId, 
        ref: 'Profile' 
      },
      date: {
        type: Date, 
        default: Date.now
      }
    }]
  },
  user: { 
    object: {
      type: ObjectId, 
      ref: 'User' 
    }
  },
  date: {
    type: Date, 
    default: Date.now
  },
  follow: Boolean,
  unseen: Number
});

profileSchema
  .path('username')
  .validate(function(value, respond) {

    return this.constructor.findOne({ username: value }).exec()
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
  }, 'The specified username is already in use');

  profileSchema
    .path('publisher.domain')
    .validate(function(value, respond) {

      return this.constructor.findOne({ 'publisher.domain': value }).exec()
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
    }, 'The specified domain is already in use');


const Profile = mongoose.model('Profile', profileSchema);

export default Profile;