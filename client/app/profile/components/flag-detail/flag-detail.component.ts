import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { 
  AuthService,
  FlagService,
  Flag,
  Activity,
  Profile
} from '../../../shared';

import {
  ProfileAuthService
} from '../../services';

@Component({
  selector: 'app-profile-flag-detail',
  templateUrl: './flag-detail.component.html',
  styleUrls: ['./flag-detail.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProfileFlagsDetailComponent implements OnInit{

  public profile: Profile = new Profile();
  public flag: Flag = new Flag(); 
  public respond: boolean = false;
  public userRole: string;

  constructor(
    private auth: AuthService,
    private flagService:FlagService,
    private profileAuthService: ProfileAuthService,
    private route: ActivatedRoute
  ) { 
    
    const id: string = route.snapshot.params.id;

    flagService.getDetail(id)
      .subscribe(
        flag => {this.flag = flag;},
        err => console.log(err)
      
      );

      flagService.getDetail(id).flatMap(flag => {
        this.flag = flag;
        return this.profileAuthService.currentProfile;
      }).subscribe(profile => {
        this.profile = profile;
      });

  }

  ngOnInit(){
   
  }

  saved(activity:Activity):void {
    
    this.flag.activity.push({
      type: activity.type,
      object: activity
    });

    if(activity.type !== 'comment'){
      this.flag.status = (activity.type === 'address') ? 'address' : 'raise';
    }
    
    this.respond = false;
  }

}
