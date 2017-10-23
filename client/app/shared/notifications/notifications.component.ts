import { Component, OnInit } from '@angular/core';

import { DatePipe } from '@angular/common';

import { 
  StreamService
} from '../services/stream.service';

import {
  AuthService
} from '../services/auth.service';

import {
  Profile
} from '../models/profile.model';

@Component({
  selector: 'app-shared-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
  providers: [DatePipe]
})
export class NotificationsSharedComponent implements OnInit {
  
  notifications: any;
  currentUser: Profile = new Profile();
  isLoading:boolean = true;

  constructor(
    private streamService: StreamService,
    private auth: AuthService,
    private date: DatePipe
  ) { 
    this.currentUser = this.auth.getCurrentUser();
  }

  ngOnInit() {

    this.streamService.notifications()
      .subscribe(
        notifications => {this.notifications = notifications; console.log(notifications)},
        error => console.log(error),
        () => this.isLoading = false 
      );
    
  }

  notificationText(item){

  //const target = (item.object.target.username === this.currentUser.username) ? 'you' : item.object.target.username;

    if(item.verb === 'follows'){
      return ' followed ';
    }

  }
}
