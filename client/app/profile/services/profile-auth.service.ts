import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/take';

import * as _ from "lodash";

import { 
    Profile, 
    ProfilesService,
    AuthService
} from '../../shared';

@Injectable()
export class ProfileAuthService {

    private currentProfileSubject = new BehaviorSubject<Profile>(new Profile());
    public currentProfile = this.currentProfileSubject.asObservable().distinctUntilChanged();

    private isUserAuthSubject = new ReplaySubject<boolean>(1);
    public isUserAuth = this.isUserAuthSubject.asObservable();

    private userRoleSubject = new ReplaySubject<string>(1);
    public userRole = this.userRoleSubject.asObservable();
  
    constructor(
        private profilesService: ProfilesService,
        private router: Router,
        private userAuth: AuthService
    ) {}

    populate(username) {

        //Avoid making dup request
        if(username === this.currentProfileSubject.value.username){
            return;
        }
    
        this.profilesService.getByUsername(username)
            .subscribe(
                data => this.setProfile(data),
                err => this.dumpProfile()
            );
    
    }

    setProfile(profile: Profile) { 
        // Set current profile
        this.currentProfileSubject.next(profile);

        this.userAuth.isAuthenticated.subscribe(
                auth => {
                    if(!auth){
                        this.isUserAuthSubject.next(false);
                        return;
                    }
        
                    this.setProfileAuth(profile);
                },
                err => this.dumpProfile()
            );

    }

    dumpProfile() {  
        // Set current profile to an empty object
        this.currentProfileSubject.next(new Profile());
        this.router.navigate(["/notfound"]);
    }

    getCurrentProfile():Profile {
        return this.currentProfileSubject.value;
    }

    setProfileAuth(profile){

        const currentUser = this.userAuth.getCurrentUser();

        if(profile.type === 'user'){
            const relation = currentUser.username === profile.username;
            this.isUserAuthSubject.next(relation);
            return;
        }

        if(profile.type === 'publisher'){

            const members = profile.publisher.members;

            for(var i=0; members.length>i; i++){
                if(_.isEqual(members[i].profile, currentUser._id)){
                    this.userRoleSubject.next(members[i].role);
                    this.isUserAuthSubject.next(true);
                }
            }
        }
    }




}
