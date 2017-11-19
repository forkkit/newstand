import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

import { ToastComponent } from '../../shared/toast/toast.component';
import { AuthService, ProfilesService } from '../../shared';

const URL = 'https://evening-anchorage-3159.herokuapp.com/api/';

@Component({
  selector: 'app-settings-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class SettingsProfileComponent{

  profileForm: FormGroup;

  constructor(
    private auth: AuthService,
    private fb: FormBuilder, 
    private profilesService: ProfilesService,
    private toast: ToastComponent
  ){
    const profile = this.auth.getCurrentUser();

    this.profileForm = fb.group({
      _id: profile._id,
      name: profile.name,
      username: profile.username,
      bio: profile.bio,
      image: profile.image
    });
  }

  imagePath(event) {
    if(event.path){
      this.profileForm.patchValue({
        image: event.path
      });
    }
  }

  submit(form){

    return this.profilesService.update(form.value).subscribe(
      profile => {
        this.auth.update(form.value);
        this.toast.setMessage('Profile successfully updated.', 'success');
      },
      err => console.log('error')
    );

  }


}
