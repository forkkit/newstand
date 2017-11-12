import * as mongoose from 'mongoose';

let ObjectId = mongoose.Schema.Types.ObjectId;

const activitySchema = new mongoose.Schema({
    user: {
        role: {
            type: String,
            default: 'user'
        },
        object: {
            _id: ObjectId,
            username: String,
            image: String
        }
    },
    flag: {
        type: ObjectId, 
        ref: 'Flag' 
    },
    address: {
        label: String,
        date: Date,
        meta: []
    },
    comment: String,
    type: {
        type: String,
        default: 'comment'
    },
    badge: String,
    date: {
      type: Date, 
      default: Date.now
    }
});

const Activity = mongoose.model('Activities', activitySchema);

export default Activity;