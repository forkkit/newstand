import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { SlugifyPipe } from 'ngx-pipes/src/app/pipes/string/slugify';

import { ToastComponent } from '../../../../shared/toast/toast.component';
import { ProfilesService } from '../../../../shared/services';
import { Profile } from '../../../../shared/models';

@Component({
  selector: 'app-settings-org-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.scss'],
  providers: [SlugifyPipe]
})
export class SettingsOrgSetupComponent {

  profile: Profile;
  handle = '';

  setupForm: FormGroup;
  name = new FormControl('', [Validators.required]);
  username = new FormControl('', [Validators.required]); 
  bio = new FormControl(''); 
  image = new FormControl(''); 


  hasUsername = false;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private profileService: ProfilesService,
    private slugifyPipe: SlugifyPipe,
    public toast: ToastComponent) {

      this.setupForm = this.formBuilder.group({
        name: this.name,
        username: this.username,
        bio: this.bio,
        image: this.image,
        type: 'publication',
        status: 'setup'
      });

      console.log(this.profile)
    }

    createUsername(value){
      if(this.hasUsername){
        return;
      }

      this.hasUsername = true;
      this.handle = this.slugifyPipe.transform(value);
    }

    handleFormat(value){
      this.handle = this.slugifyPipe.transform(value);
    }


    submit(){
      console.log(this.setupForm.value)

      this.profileService.create(this.setupForm.value)
      .subscribe(
        data => {
          console.log(data);
        },
        err => {
          this.toast.setMessage(err.error, 'danger'); 
        }
      );
    }

}
