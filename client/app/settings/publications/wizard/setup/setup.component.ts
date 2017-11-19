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

  public handle = '';
  public hasUsername = false;
  public publisher: Profile = new Profile();
  public setupForm: FormGroup;
  public nameCtrl: FormControl;
  public usernameCtrl: FormControl;
  public domainCtrl: FormControl;
  public errors = {};
  private subscription;
  public submitted: boolean = false;

  constructor(
    private router: Router,
    private _fb: FormBuilder,
    private auth: AuthService,
    private wizardAuth: WizardAuth,
    private wizardService: WizardService,
    private slugifyPipe: SlugifyPipe,
    public toast: ToastComponent) {

      const currentUser = this.auth.getCurrentUser();

      this.nameCtrl = this._fb.control('', Validators.required);
      this.usernameCtrl = this._fb.control('', Validators.required);
      this.domainCtrl = this._fb.control('', Validators.required);

      this.setupForm = _fb.group({
          name: this.nameCtrl ,
          username: this.usernameCtrl,
          bio: '',
          image: '/assets/pub_placeholder.png',
          type: 'publisher',
          publisher: _fb.group({
            domain: this.domainCtrl,
            members:[{
              profile: currentUser._id,
              username: currentUser.username,
              role: 'owner'
            }]
          })
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

    domainFormat(value){ 

      const result = value.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "").split('/')[0];

      this.setupForm.patchValue({
        publisher:{
          domain: result
        }
      });

    }

    imagePath(event) {

      if(event.path){
        this.setupForm.patchValue({
          image: event.path
        });
      }
    }

    submit(model: Profile, isValid: boolean){

      this.submitted = true;

      // check validity
      if(!isValid){
        //this.toast.setMessage('Please complete all required fields', 'danger');
        return;
      }

      // save
      if(!model._id){

        return this.wizardService.setup(model).subscribe(
          data => {
            this.wizardAuth.updatePublisher(data);
            this.router.navigate(['settings/publications/create/members', data._id])
          },
          err => {
            err = JSON.parse(err.error);

            this.errors = {};

            for(let field in err.errors){
              this.errors[field] = err.errors[field].message;
            }

          }
        );
      }

      // update
      return this.wizardService.updateSetup(model._id, model).subscribe(
        data => {
          this.wizardAuth.updatePublisher(model);
          this.router.navigate(['settings/publications/create/members', model._id])
        },
        err => {
          err = JSON.parse(err.error);
          
          this.errors = {};

          for(let field in err.errors){
            this.errors[field] = err.errors[field].message;
          }

        }
      );

    }

    ngOnDestroy() {
      this.subscription.unsubscribe();
    }

}
