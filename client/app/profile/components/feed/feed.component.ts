import { Component, OnInit  } from '@angular/core';

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

    this.profileAuth.currentProfile
      .subscribe(profile => this.loadFeed(profile));    

  }

  loadFeed(profile){

    this.subscription = this.streamService.feed(profile._id)
      .subscribe(
        feed => { this.feed = feed;},
        error => console.log(error),
        () => this.isLoading = false 
      );

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
