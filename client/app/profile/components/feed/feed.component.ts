import { Component, OnInit  } from '@angular/core';
import 'rxjs/add/operator/skipWhile';
import 'rxjs/add/operator/switchMap';

import { 
  StreamService
} from '../../../shared';

import { 
  ProfileAuthService
} from '../../services';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss'],
})
export class FeedComponent implements OnInit {

  private subscription;
  public feed: any = [];
  isLoading:boolean = true;
  
  constructor(
    private streamService: StreamService,
    private profileAuth: ProfileAuthService
  ) { }

  ngOnInit() {

    this.subscription = this.profileAuth.currentProfile
      .skipWhile(profile => { return !profile._id; })
      .switchMap(profile => this.streamService.feed(profile._id))   
      .subscribe(
        feed => { this.feed = feed; this.isLoading = false;},
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

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
