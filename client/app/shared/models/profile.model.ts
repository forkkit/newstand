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
    role?: string;
    publisher?: {
        id?: string;
        status?:number;
        public?:boolean;
        domain?: string;
        subdomains?: Array<string>,
        members?: [{
            username?: string;
            role?: string;
            profile?: string;
            date?: string;
        }];
    }
    user?: {
        object?: User
    }
    follow?: boolean;
    unseen?: number;

    
   
}