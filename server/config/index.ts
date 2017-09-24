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
    facebook: {
        clientID: process.env.FACEBOOK_ID || 'id',
        clientSecret: process.env.FACEBOOK_SECRET || 'secret',
        callbackURL: `${process.env.DOMAIN || ''}/api/auth/facebook/callback`
    },
    google: {
        clientID: process.env.GOOGLE_ID || 'id',
        clientSecret: process.env.GOOGLE_SECRET || 'secret',
        callbackURL: `${process.env.DOMAIN || ''}/api/auth/google/callback`
    },
}

export default all;