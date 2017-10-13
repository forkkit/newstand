import {Publisher} from './publisher.model';
import {User} from './user.model';

export class Data{
    profile: Profile;
    token: string;
}

export class Profile {
    _id?: string;
    name?: string;
    username?: string;
    image?: string;
    bio?: string;
    status?: string;
    type?: string;
    publisher?: {
        status?:number;
        members?: [{
            username?: string;
            role?: string;
            profile?: string;
            date?: string;
        }];
        object?: Publisher
    }
    user?: {
        object?: User
    }

    
   
}