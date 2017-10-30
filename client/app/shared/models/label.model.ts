import { Interaction } from './interaction.model';
import { Profile } from './profile.model';

export class Label{
    _id?: string;
    url?: string;
    section?: string;
    label?: string;
    description?: string;
    interaction?: [{
        type?: string;
        object?: Interaction;
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
