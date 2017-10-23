import config from './index';

const stream          = require('getstream'),
streamNode      = require('getstream-node');

const all = {

    client: stream.connect(config.stream.key, config.stream.secret),

}

export default all;