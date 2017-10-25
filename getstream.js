
exports.config = {
	/**
  * GetStream.io API key
  */
	apiKey: process.env.STREAM_KEY,

	/**
  * GetStream.io API Secret
  */
	apiSecret: process.env.STREAM_SECRET,

	/**
  * GetStream.io API App ID
  */
	apiAppId: process.env.STREAM_ID,

	/**
  * GetStream.io API Location
  */
	apiLocation: '',

	/**
  * GetStream.io User Feed slug
  */
	userFeed: 'Profile',


	/**
  * GetStream.io Notification Feed slug
  */
	notificationFeed: 'notification',

	newsFeeds: {
		/**
    * GetStream.io Flat Feed slug
    */
		flat: 'timeline',

		/**
    * GetStream.io Aggregated Feed slug
    */
		aggregated: 'timeline_aggregated'
		
	},
};