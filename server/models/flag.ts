import * as mongoose from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate';

let ObjectId = mongoose.Schema.Types.ObjectId;

const flagSchema = new mongoose.Schema({
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
    activity:[{
      type:{
        type: String
      },
      object: {
        type: ObjectId, 
        ref: 'Activities' 
      }
    }],
    status:{
      type: String,
      default: 'raise'
    },
    date: {
      type: Date, 
      default: Date.now
    }
});

flagSchema.plugin(mongoosePaginate);

const Flag = mongoose.model('Flag', flagSchema);

export default Flag;