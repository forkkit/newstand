import {Profile} from './profile.model';

export class Data{
    user: User;
    token: string;
}

 export class User{
    id?: string;
    _id?: string;
    email?: string;
    role?: string;
    profile?: Profile;
 }
