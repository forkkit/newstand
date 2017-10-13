import {Profile} from './profile.model';

export class Publisher {
    _id?: string;
    name?: string;
    domain?: string;
    subdomains?: Array<string>;
    status?: string;
    profile?: Profile;
}