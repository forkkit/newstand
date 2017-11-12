import {Profile} from './profile.model';

export class Activity{
    _id?: string;
    user?: {
        role?:string;
        object?: Profile;
    };
    flag?: string;
    address?: {
        label?: string;
        data?: string;
        meta?: any;
    };
    comment?: string;
    type?:string;
    badge?:string;
    date?:string;
 }
