import * as mongoose from 'mongoose';
import * as stream_node from 'getstream-node';
 
const Schema = mongoose.Schema;
const FeedManager = stream_node.FeedManager;
const StreamMongoose = stream_node.mongoose;

/*
	Start Flags
*/

const flagSchema = new Schema(
	{
		user: { type: Schema.Types.ObjectId, required: true, ref: 'Profile' },
		target: { type: Schema.Types.ObjectId, required: true, ref: 'Profile' },
		flag: { type: Schema.Types.ObjectId, required: true, ref: 'Flag' },
		type: { type: String }
	},
	{
		collection: 'streamFlags',
	},
);

flagSchema.plugin(StreamMongoose.activity);

flagSchema.statics.pathsToPopulate = function() {
	return ['user', 'target', 'flag'];
};

flagSchema.methods.activityForeignId = function() {
	return this.user._id + ':' + this.target._id;
};

flagSchema.methods.createActivity = function() { 
	
      var activity:any = {};
      var extra_data = this.activityExtraData();
      for (var key in extra_data) {
          activity[key] = extra_data[key];
	  }
	  
	  //To Field 
	  const publisher = this.target.publisher, toField = ['timeline:global'];
	  //Push to publisher timeline
	  toField.push('timeline:'+this.target._id);
	  if(publisher && publisher.members.length > 0){
		//Push to publisher admins notification feed
		for(let i = 0; publisher.members.length>i; i++){
			if(!publisher.members[i].profile.equals(this.user._id))
				toField.push('notification:'+publisher.members[i].profile);
		}
	  }
	  activity.to = toField;

      activity.actor = this.activityActor();
      activity.verb = this.type;
      activity.object = this.activityObject();
      activity.foreign_id = this.activityForeignId();
      if (this.activityTime()) {
          activity.time = this.activityTime();
      }
      return activity;
}


const Flag = mongoose.model('streamFlags', flagSchema);

/*
	End Flags
*/

/*
	Start Activity
*/

const activitySchema = new Schema(
	{
		user: { type: Schema.Types.ObjectId, required: true, ref: 'Profile' },
		target: { type: Schema.Types.ObjectId, required: true, ref: 'Profile' },
		activity: { type: Schema.Types.ObjectId, required: true, ref: 'Activities' },
		type: { type: String }
	},
	{
		collection: 'streamFlags',
	},
);

activitySchema.plugin(StreamMongoose.activity);

activitySchema.statics.pathsToPopulate = function() {
	return ['user', 'target', 'activity'];
};

activitySchema.methods.activityForeignId = function() {
	return this.user._id + ':' + this.target._id;
};

activitySchema.methods.createActivity = function() { 
	
	var activity:any = {};
	var extra_data = this.activityExtraData();
	for (var key in extra_data) {
		activity[key] = extra_data[key];
	}
	
	//To Field 
	const publisher = this.target.publisher, toField = ['timeline:global'];
	//Push to publisher timeline if admin
	if(this.activity.user.role !== 'user'){
		toField.push('timeline:'+this.target._id);
	}

	if(publisher && publisher.members.length > 0){
		//Push to publisher admins notification feed
		for(let i = 0; publisher.members.length>i; i++){
			if(!publisher.members[i].profile.equals(this.user._id))
				toField.push('notification:'+publisher.members[i].profile);
		}
	}

	activity.to = toField;

	activity.actor = this.activityActor();
	activity.verb = this.type;
	activity.object = this.activityObject();
	activity.foreign_id = this.activityForeignId();
	if (this.activityTime()) {
		activity.time = this.activityTime();
	}
	return activity;
}


const Activity = mongoose.model('streamActivities', activitySchema);

/*
	End Activity
*/

/*
	Start Follow
*/

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
	Activity: Activity,
	Flag: Flag
}
    
export default models;

/*
	End Activity
*/