import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { 
  FlagService,
  Flag,
  Activity
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

  public flag: Flag = new Flag(); 
  public respond: boolean = false;
  public userRole: string;

  constructor(
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

  }

  ngOnInit(){
    this.profileAuthService.userRole.subscribe(
      role => this.userRole = role,
      err => console.log(err)
    );
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
