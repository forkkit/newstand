import { Component, OnInit } from '@angular/core';

import { 
  Profile,
  StreamService
} from '../../shared';

import { 
  ProfileAuthService,
} from '../services';

@Component({
  selector: 'app-profile-publisher',
  templateUrl: './publisher.component.html',
  styleUrls: ['./publisher.component.css']
})
export class PublisherProfileComponent implements OnInit {

  private subscription;
  public profile: Profile = new Profile();
  public userAuth: boolean;

  constructor(
    private profileAuth: ProfileAuthService,
    private streamService: StreamService
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

  follow(id){
    this.streamService.follow({target: id})
      .subscribe(follow => {this.profile.follow = true});
  }


}
