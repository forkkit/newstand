import * as mongoose from 'mongoose';

let ObjectId = mongoose.Schema.Types.ObjectId;

const publisherSchema = new mongoose.Schema({
    domain: String,
    subdomains: [],
    date: {
      type: Date, 
      default: Date.now
    }
});

const Publisher = mongoose.model('Publisher', publisherSchema);

export default Publisher;