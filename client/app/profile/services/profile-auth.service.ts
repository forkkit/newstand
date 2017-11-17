import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import 'rxjs/add/operator/distinctUntilChanged';

import { 
    Profile, 
    ProfilesService
} from '../../shared';

@Injectable()
export class ProfileAuthService {

    private currentProfileSubject = new BehaviorSubject<Profile>(new Profile());
    public currentProfile = this.currentProfileSubject.asObservable().distinctUntilChanged();
  
    constructor(
        private profilesService: ProfilesService
    ) {}

    setProfile(profile: Profile) {

        this.currentProfileSubject.next(new Profile());
        // Set current profile
        this.currentProfileSubject.next(profile);

    }

    dumpProfile() {  
        // Set current profile to an empty object
        this.currentProfileSubject.next(new Profile());
    }

    getCurrentProfile():Profile {
        return this.currentProfileSubject.value;
    }

}
