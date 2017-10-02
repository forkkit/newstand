/**
 * Express configuration
 */

import * as express from 'express';
import * as favicon from 'serve-favicon';
import * as morgan from 'morgan';
import * as bodyParser from 'body-parser';
import * as path from 'path';
import * as passport from 'passport';

import config from './index';

import UserRouter from '../api/user/user.router';
import ProfileRouter from '../api/profile/profile.router';
import AuthRouter from '../auth';

class App {

    public express: express.Application;
    public env: string;

    constructor() {
        this.express = express();
        this.env = this.express.get('env');
        this.middleware();
        this.routes();
    }

    private middleware(): void {
        if(this.env === 'production') {
            this.express.use(favicon(path.join(config.root, 'client', 'favicon.ico')));
        }
        this.express.set('appPath', path.join(config.root, 'client'));
        this.express.use(express.static(this.express.get('appPath')));
        this.express.use(morgan('dev'));
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
        this.express.use(passport.initialize());
    }

    // API endpoints
    private routes(): void {
        this.express.use('/api/users', UserRouter);
        this.express.use('/api/profiles', ProfileRouter);

        this.express.use('/api/auth', AuthRouter);
    }
}

export default new App().express;