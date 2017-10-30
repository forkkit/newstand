import * as mongoose from 'mongoose';

let ObjectId = mongoose.Schema.Types.ObjectId;

const interactionSchema = new mongoose.Schema({
    user: {
        username: String,
        role: String
    },
    comment: String,
    action:{
        type: {
            type: String
        }
    },
    date: {
      type: Date, 
      default: Date.now
    }
});

const Interaction = mongoose.model('Interaction', interactionSchema);

export default Interaction;