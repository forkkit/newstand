import { Component, OnInit } from '@angular/core';
import { Router, RouterLinkActive, RoutesRecognized } from '@angular/router';

import { Profile } from '../../../shared';

import { WizardAuth } from './services';

@Component({
  selector: 'app-settings-wizard',
  templateUrl: './wizard.component.html',
  styleUrls: ['./wizard.component.scss']
})
export class WizardComponent implements OnInit {

  statusArray: string[];
  profile: Profile = new Profile();

  private subscription;
  constructor(
    private wizardAuth: WizardAuth,
    private router: Router
  ) {
    
    this.statusArray = ['setup', 'members', 'details'];

    this.profile = {
      _id: '',
      publisher:{
        status: -1
      }
    }

  }

  ngOnInit() {

    this.setStatus(this.wizardAuth.getCurrentPublisher());

    this.subscription = this.router.events
      .subscribe((event) => {
        if(event instanceof RoutesRecognized) {

          this.setStatus(this.wizardAuth.getCurrentPublisher());
          
        }
      }
    );

  } 

  setStatus(profile){ 

    if(!profile._id){
      return;
    }
    
    this.profile = profile;

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

 }
