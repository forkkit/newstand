import { Component, Input,  OnInit, Output, EventEmitter  } from '@angular/core';

import { 
  StreamService
} from '../../shared/services/stream.service';

import { 
  Profile
} from '../../shared/models/profile.model';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss'],
})
export class FeedComponent implements OnInit {
  
  @Input() profile: Profile = new Profile(); 
  @Output() viewMore = new EventEmitter();

  private subscription;
  public feed: any = [];
  public isLoading:boolean = true;

  constructor(
    private streamService: StreamService
  ) { }

  ngOnInit() { 

    this.subscription = this.streamService.feed(this.profile._id)  
      .subscribe(
        feed => { 
          this.feed = feed; 
          this.viewMore.emit(feed.nextActivityData);
          this.isLoading = false;
        },
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

  loadMore(){

    this.streamService.feedMore(this.profile._id, this.feed.nextActivityData.results[0].id)
      .subscribe(
        feed => { 

          [].push.apply(this.feed.activityData, feed.activityData);
                    
          this.viewMore.emit(feed.nextActivityData);

        },
        error => console.log(error)
      );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
