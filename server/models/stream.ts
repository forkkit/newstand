import * as mongoose from 'mongoose';
import * as stream_node from 'getstream-node';
 
const Schema = mongoose.Schema;
const FeedManager = stream_node.FeedManager;
const StreamMongoose = stream_node.mongoose;

const labelSchema = new Schema(
	{
		user: { type: Schema.Types.ObjectId, required: true, ref: 'Profile' },
		target: { type: Schema.Types.ObjectId, required: true, ref: 'Profile' },
		label: { type: Schema.Types.ObjectId, required: true, ref: 'LabelDetail' },
	},
	{
		collection: 'labels',
	},
);

labelSchema.plugin(StreamMongoose.activity);

labelSchema.methods.activityNotify = function() {
	const target_feed = FeedManager.getNotificationFeed(this.target._id); 
	return [target_feed];
};

labelSchema.statics.pathsToPopulate = function() {
	return ['user', 'label'];
};

labelSchema.methods.activityForeignId = function() {
	return this.user._id + ':' + this.label._id;
};

labelSchema.methods.createActivity = function() { 
	// this is the default createActivity code, customize as you see fit.
      var activity:any = {};
      var extra_data = this.activityExtraData();
      for (var key in extra_data) {
          activity[key] = extra_data[key];
	  }
	  
	  const publisher = this.target.publisher, toField = [];

	  if(publisher && publisher.members.length > 0){
		for(let i = 0; publisher.members.length>i; i++){
			if(!publisher.members[i].profile.equals(this.user._id))
				toField.push('notification:'+publisher.members[i].profile);
		}
	  }

	  activity.to = toField;
      activity.actor = this.activityActor();
      activity.verb = this.activityVerb();
      activity.object = this.activityObject();
      activity.foreign_id = this.activityForeignId();
      if (this.activityTime()) {
          activity.time = this.activityTime();
      }
      return activity;
}


const Label = mongoose.model('labels', labelSchema);


const followSchema = new Schema(
	{
		user: { type: Schema.Types.ObjectId, required: true, ref: 'Profile' },
		target: { type: Schema.Types.ObjectId, required: true, ref: 'Profile' },
	},
	{
		collection: 'follows',
	},
);

followSchema.plugin(StreamMongoose.activity);

followSchema.methods.activityNotify = function() {
	const target_feed = FeedManager.getNotificationFeed(this.target._id);
	return [target_feed];
};

followSchema.methods.activityForeignId = function() {
	return this.user._id + ':' + this.target._id;
};

followSchema.statics.pathsToPopulate = function() {
	return ['user', 'target'];
};

followSchema.post('save', function(doc) {
	if (doc.wasNew) { 
		const userId = doc.user._id || doc.user;
		const targetId = doc.target._id || doc.target; 
		FeedManager.followUser(userId, targetId);
	}
});

followSchema.post('remove', function(doc) {
	FeedManager.unfollowUser(doc.user, doc.target);
});

const Follow = mongoose.model('follows', followSchema);

StreamMongoose.setupMongoose(mongoose);

const models = {
    Follow: Follow,
    Label: Label
}
    
export default models;