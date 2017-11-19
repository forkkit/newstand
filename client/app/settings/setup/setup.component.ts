import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

import { ToastComponent } from '../../shared/toast/toast.component';
import { AuthService, ProfilesService } from '../../shared/services';
import { Profile } from '../../shared/models';


@Component({
  selector: 'app-settings-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.scss']
})
export class SettingsSetupComponent implements OnInit {
  
  isLoading = true;

  setupForm: FormGroup;
  currentUser: Profile;

  constructor(
    private auth: AuthService,
    private profile: ProfilesService,
    private router: Router,
    private formBuilder: FormBuilder,
    public toast: ToastComponent) {

      this.setupForm = this.formBuilder.group({
        username: ['', <any>Validators.required],
        bio: '',
        image: ''
      });
    }

  ngOnInit() {
    this.auth.currentUser.subscribe(
      (user: Profile) => {

        this.setupForm.patchValue({
          username: user.username,
          image: user.image
        });

        this.currentUser = user;

      }
    );
  }

  imagePath(event) {
    if(event.path){
      this.setupForm.patchValue({
        image: event.path
      });
    }
  }

  submit(model: Profile, isValid: boolean) { 

    if(isValid){
      this.profile.username(model)
        .subscribe(
          data => {
            this.auth.update(data);
            this.router.navigate(['/' + data.username])
          },
          err => {
            this.toast.setMessage(err.error, 'danger'); 
          }
        );
    }

  }

}
