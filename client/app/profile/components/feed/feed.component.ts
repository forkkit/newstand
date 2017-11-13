import { Component, OnInit, ViewChild  } from '@angular/core';
import 'rxjs/add/operator/skipWhile';
import 'rxjs/add/operator/switchMap';

import { FeedComponent } from '../../../shared/feed/feed.component';

import { 
  Profile,
  StreamService
} from '../../../shared';

import { 
  ProfileAuthService
} from '../../services';

@Component({
  selector: 'app-profile-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss'],
})
export class ProfileFeedComponent implements OnInit {

  @ViewChild('FeedComponent') FeedComponent;

  public profile: Profile = new Profile(); 

  private subscription;
  public hasMore:boolean = false;
  public viewMoreLoad:boolean = false;

  
  constructor(
    private streamService: StreamService,
    private profileAuth: ProfileAuthService
  ) { }

  ngOnInit() {

    this.profileAuth.currentProfile
      .skipWhile(profile => { return !profile._id; }) 
      .subscribe(
        profile => { this.profile = profile;},
        error => console.log(error)
      );
  }

  commentCount(activity){

    if(activity.length === 0){
      return false;
    }
  
    let count=0;
    for(let i = 0; i < activity.length; i++){
      if(activity[i].type === 'comment'){
        count++;
      }
    }

    return count ? count : false;
  }

  viewMore(event){
    this.viewMoreLoad = false;
    this.hasMore = (event && event.results.length > 0) ? true : false;
  }

  loadMore(){
    this.viewMoreLoad = true;
    this.FeedComponent.loadMore();
  }

}
