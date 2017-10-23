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
  publisher: {
    status: {
      type: Number, 
      default: 0
    },
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
    }], 
    object: {
      type: ObjectId, 
      ref: 'Publisher' 
    }
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
}, 'The specified username is already in use.');


const Profile = mongoose.model('Profile', profileSchema);

export default Profile;