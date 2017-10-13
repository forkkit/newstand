import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

import { ToastComponent } from '../../../../shared/toast/toast.component';
import { WizardService, WizardAuth } from '../services';
import { Publisher, AuthService } from '../../../../shared';

@Component({
  selector: 'app-wizard-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss']
})
export class WizardMembersComponent implements OnInit {

  private publisher: Publisher = new Publisher();

  private subscription;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private wizardService: WizardService,
    private wizardAuth: WizardAuth,
    public toast: ToastComponent) { }
 
  ngOnInit() {
    
    this.subscription = this.wizardAuth.currentPublisher.subscribe(
      (results) => {
        this.publisher = results;
      }
    );

  }
    
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  submit(){

    return this.wizardService.members(this.publisher._id, {}).subscribe(
      data => {
        this.wizardAuth.updatePublisher(data);
        this.router.navigate(['settings/publications/create/details', this.publisher._id]);
      },
      err => this.toast.setMessage(err.error, 'danger')
    );

  }

}
