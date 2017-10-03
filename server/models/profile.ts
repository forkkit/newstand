import * as mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
    username: String,
    image: String,
    bio: String,
    type: {
      type: String
    },  
    status: {
      type: String,
      default: 'pending'
    },
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