import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { 
  Profile 
} from '../shared';

import { 
  ProfileAuthService,
} from './services';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit{

  private subscription;
  public profile: Profile = new Profile();

  constructor(
    private profileAuth: ProfileAuthService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(){

    //Update profile data based on username
    this.route.params
      .subscribe(params=>{this.profileAuth.populate(params.username)})
    
    this.subscription = this.profileAuth.currentProfile
      .subscribe(profile => this.profile = profile);

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
