import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { FileUploader } from "angular-file";

import { ToastComponent } from '../../shared/toast/toast.component';
import { AuthService, ProfilesService } from '../../shared';

const URL = 'https://evening-anchorage-3159.herokuapp.com/api/';

@Component({
  selector: 'app-settings-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class SettingsProfileComponent implements OnInit{

  profileForm: FormGroup;

  constructor(
    private auth: AuthService,
    private fb: FormBuilder, 
    private profilesService: ProfilesService
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

  ngOnInit(){

  }

  submit(form){

    return this.profilesService.update(form.value).subscribe(
      profile => this.auth.update(form.value),
      err => console.log('error')
    );

  }


}
