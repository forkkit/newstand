import { Injectable, Output } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import 'rxjs/add/operator/distinctUntilChanged';
import * as _ from "lodash";

import { Profile } from '../../../../shared';

import { WizardService } from './wizard.service';

@Injectable()
export class WizardAuth {

    constructor(
        private wizardService: WizardService
    ) {}

    private currentPublisherSubject = new BehaviorSubject<Profile>(new Profile());
    public currentPublisher = this.currentPublisherSubject.asObservable().distinctUntilChanged();

    private isReadySubject = new ReplaySubject<boolean>(1);
    public isReady = this.isReadySubject.asObservable();

  
    setPublisher(publisher: WizardService) {

        if(!publisher){
            this.currentPublisherSubject.next(new Profile());
            this.isReadySubject.next(true);
            return;
        }
        
        const id = this.currentPublisherSubject.value._id;

        if(_.isEqual(publisher, id)){
            this.isReadySubject.next(true);
            return;
        }
        
        this.wizardService.get(publisher)
            .subscribe(
                data => {
                    this.currentPublisherSubject.next(data);
                    this.isReadySubject.next(true);
                },
                err => console.log(err)
            );

    }

    getCurrentPublisher(): Profile {
        return this.currentPublisherSubject.value;
    }

    updatePublisher(publisher) {
        this.currentPublisherSubject.next(publisher)
      }
    

}
