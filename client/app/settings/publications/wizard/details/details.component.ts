import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

import { ToastComponent } from '../../../../shared/toast/toast.component';

import { WizardAuth, WizardService } from '../services';
import { Publisher } from '../../../../shared';

@Component({
  selector: 'app-wizard-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class WizardDetailsComponent implements OnInit {

  detailsForm: FormGroup;
  domain = new FormControl('', [Validators.required]);
  subdomains = new FormControl(''); 

  private publisher: Publisher = new Publisher();
  private subscription;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private wizardAuth: WizardAuth,
    private wizardService: WizardService,
    public toast: ToastComponent) {

      this.detailsForm = this.formBuilder.group({
        domain: this.domain,
        subdomains: this.subdomains
      });

    }
 
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
    
    return this.wizardService.details(this.publisher._id, {}).subscribe(
      data => {
        this.wizardAuth.updatePublisher(data);
        console.log(data);
      },
      err => this.toast.setMessage(err.error, 'danger')
    );

  }

}
