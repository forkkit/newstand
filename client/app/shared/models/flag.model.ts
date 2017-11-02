import { Activity } from './activity.model';
import { Profile } from './profile.model';

export class Flag{
    _id?: string;
    url?: string;
    section?: string;
    label?: string;
    description?: string;
    activity?: [{
        type?: string;
        object?: Activity;
    }];
    status?: string;
    publication?: {
        profile?: Profile;
        username?: string;
    };
    user?: {
        profile?: Profile;
        username?: string;
    };
    data?: string;
 }
