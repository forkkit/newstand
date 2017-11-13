import { Component, OnInit, ViewChild } from '@angular/core';

import { FeedComponent } from '../shared/feed/feed.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
 
  @ViewChild('FeedComponent') FeedComponent;

  public hasMore:boolean = false;
  public viewMoreLoad:boolean = false;

  constructor() { }

  ngOnInit() {

  }

  loginOauth(provider){
      window.location.href=`/api/auth/${provider}`;
  }

  viewMore(event){ 
    this.viewMoreLoad = false;
    this.hasMore = (event.results.length > 0) ? true : false;
  }

  loadMore(){
    this.viewMoreLoad = true;
    this.FeedComponent.loadMore();
  }

}
