import { Component, OnInit } from '@angular/core';

import { 
  Profile 
} from '../../shared';

import { 
  ProfileAuthService,
} from '../services';

@Component({
  selector: 'app-profile-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserProfileComponent implements OnInit {

  private subscription;
  public profile: Profile = new Profile();
  public userAuth: boolean;

  constructor(
    private profileAuth: ProfileAuthService
  ) { }

  ngOnInit() {

    this.subscription = this.profileAuth.currentProfile
      .subscribe(profile => this.profile = profile);

    this.profileAuth.isUserAuth
      .subscribe(auth => this.userAuth = auth);


  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
