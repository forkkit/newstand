import * as mongoose from 'mongoose';

let ObjectId = mongoose.Schema.Types.ObjectId;

const labelSchema = new mongoose.Schema({
    url: String,
    section: String,
    label: String,
    description: String,
    user: {
      username: String,
      profile: {
        type: ObjectId, 
        ref: 'Profile' 
      }
    },
    publisher: {
      username: String,
      profile: {
        type: ObjectId, 
        ref: 'Profile' 
      }
    },
    date: {
      type: Date, 
      default: Date.now
    }
});

const Label = mongoose.model('Label', labelSchema);

export default Label;