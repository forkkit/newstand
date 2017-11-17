import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

import { WizardService, WizardAuth } from '../services';

import { 
  AuthService,
  FlagService,
  Profile
} from '../../../../shared';

import Utils from '../../../../shared/utils';

@Component({
  selector: 'app-wizard-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss']
})
export class WizardVerifyComponent implements OnInit {

  public profile: Profile = new Profile();
  public verifyForm: FormGroup;
  private subscription;
  private baseUrl: string;
  public error: boolean = false;
  public errorMessage: string;
  public isLoading:boolean = false;
  public allowContent:boolean = false;
  public isVerified:boolean = false;
  public contentErr:string;
  public urlCtrl: FormControl;

  constructor(
    private router: Router,
    private _fb: FormBuilder,
    private wizardAuth: WizardAuth,
    private wizardService: WizardService,
    private flagService: FlagService
  ) {

      this.urlCtrl = this._fb.control('', Validators.required);

      this.verifyForm = _fb.group({
        url: this.urlCtrl,
        segment: ['', <any>Validators.required],
      });

    }

    ngOnInit() {

      this.subscription = this.wizardAuth.currentPublisher.subscribe(
        (results) => {
          this.profile = results;
        }
      );

    }

    verifyDomain(url, el){
      //If input empty or baseUrl has not changed
      if(!url || url.indexOf(this.baseUrl) >= 0){
        return;
      }

      this.error = false;
      this.isLoading = true;
      this.baseUrl = Utils.extractHost(url);

      return this.flagService.searchByDomain({url: this.baseUrl}).subscribe(
        data => {
          
          this.isLoading = false;
          this.profile = data;

          if(data.error){
            this.error = true;
            this.allowContent = false;
            this.errorMessage = `${data.domain} does not match base domain provided in Step 1`;
          }

          this.allowContent = true;
          el.focus();
        },
        err => console.log(err)
      );

    }


    verifyContent(text){

      //If textarea empty
      if(!text){
        return;
      }

      const obj = {
        profile: this.profile.publisher,
        url: this.urlCtrl.value,
        section:text
      }

      return this.wizardService.segment(obj).subscribe(
        data => {

          if(data){
            this.isVerified = true;
          }

        },
        err => {          
          this.contentErr = err.error;
        }
      );

    }

    submit(model: Profile, isValid: boolean){
      
      if(isValid){
        return this.wizardService.verify({_id:this.profile._id}).subscribe(
          data => {
            
            this.router.navigate(['/', data.username]);
  
          },
          err => console.log(err)
        );
      }
      
    }

    ngOnDestroy() {
      this.subscription.unsubscribe();
    }

}
