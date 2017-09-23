import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.load({ path: '.env' });

const all = {
    env: process.env.NODE_ENV,
    root: path.normalize(`${__dirname}/../../..`),
    port: process.env.PORT || 3000,
    ip: process.env.IP || '0.0.0.0',
    secrets: {
        session: process.env.SESSION_SECRET
    },
    mongo: {
        uri: process.env.MONGODB_URI,
        options: {
            db: {
              safe: true
            }
        }
    },
}

export default all;