import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { SlugifyPipe } from 'ngx-pipes/src/app/pipes/string/slugify';

import { ToastComponent } from '../../../../shared/toast/toast.component';
import { WizardService, WizardAuth } from '../services';

import { 
  AuthService,
  Profile
} from '../../../../shared';

@Component({
  selector: 'app-wizard-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.scss'],
  providers: [SlugifyPipe]
})
export class WizardSetupComponent implements OnInit {

  handle = '';
  hasUsername = false;
  publisher: Profile = new Profile();

  setupForm: FormGroup;

  private subscription;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private auth: AuthService,
    private wizardAuth: WizardAuth,
    private wizardService: WizardService,
    private slugifyPipe: SlugifyPipe,
    public toast: ToastComponent) {

      const currentUser = this.auth.getCurrentUser();

      this.setupForm = fb.group({
          name: ['', Validators.required],
          username: ['', Validators.required],
          bio: '',
          image: '/assets/pub_placeholder.png',
          type: 'publisher',
          publisher: {
            members:[{
              profile: currentUser._id,
              username: currentUser.username,
              role: 'owner'
            }]
          }
      });

    }

    ngOnInit() {

      this.subscription = this.wizardAuth.currentPublisher.subscribe(
        (results) => {
          
          if(!results._id){
            return;
          }
          
          this.hasUsername = true;
          this.handle = results.username;
          this.publisher = results;

          //Add _id for existing
          this.setupForm.addControl('_id', new FormControl(''));
          this.setupForm.patchValue(results);
          
        }
      );

    }

    ngOnDestroy() {
      this.subscription.unsubscribe();
    }

    createUsername(value){
      if(this.hasUsername || !value){
        return;
      }

      this.hasUsername = true;
      this.handle = this.slugifyPipe.transform(value);
    }

    handleFormat(value){
      this.handle = this.slugifyPipe.transform(value);
    }


    submit(form){

      // save
      if(!form.value._id){

        return this.wizardService.setup(form.value).subscribe(
          data => {
            this.wizardAuth.updatePublisher(data);
            this.router.navigate(['settings/publications/create/members', data._id])
          },
          err => this.toast.setMessage(err.error, 'danger')
        );
      }

      // form untouched
      if(form.pristine){
        this.router.navigate(['settings/publications/create/members', form.value._id]);
        return;
      }
      
      // update
      return this.wizardService.updateProfile(form.value._id, form.value).subscribe(
        data => {
          this.wizardAuth.updatePublisher(form.value);
          this.router.navigate(['settings/publications/create/members', form.value._id])
        },
        err => this.toast.setMessage(err.error, 'danger')
      );

    }

}
