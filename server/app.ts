import * as mongoose from 'mongoose';
import * as http from 'http';

import config from './config';
import App from './config/express';

// Connect to MongoDB
mongoose.connect(config.mongo.uri, config.mongo.options);
const db = mongoose.connection;
(<any>mongoose).Promise = global.Promise;
db.on('error', function(err) {
  console.error(`MongoDB connection error: ${err}`);
  process.exit(-1); // eslint-disable-line no-process-exit
});

// Start server
const server = http.createServer(App);

function startServer() {
  server.listen(config.port, config.ip, function() {
    console.log('Express server listening on %d, in %s mode', config.port, App.get('env'));
  });
}

setImmediate(startServer);
