import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { FileUploader } from "angular-file";

import { ToastComponent } from '../../shared/toast/toast.component';
import { AuthService, ProfilesService } from '../../shared/services';
import { User } from '../../shared/models';
const URL = 'https://evening-anchorage-3159.herokuapp.com/api/';
@Component({
  selector: 'app-settings-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.scss']
})
export class SettingsSetupComponent implements OnInit {

  currentUser: User;
  
  isLoading = true;

  usernameForm: FormGroup;
  username = new FormControl('', [Validators.required]);
  

  public uploader:FileUploader = new FileUploader({url: URL});

  constructor(
    private auth: AuthService,
    private profile: ProfilesService,
    private router: Router,
    private formBuilder: FormBuilder,
    public toast: ToastComponent) {

      this.usernameForm = this.formBuilder.group({
        username: this.username
      });
    }

  ngOnInit() {
    this.getUser();
  }

  getUser() {
    this.auth.currentUser.subscribe(
      (userData: User) => {
        this.currentUser = userData;
      }
    );
  }

  submit() {

    this.profile.username(this.currentUser)
      .subscribe(
        data => {
          this.auth.updateUser(data.user);
          this.router.navigate(['/' + data.user.profile.username])
        },
        err => {
          this.toast.setMessage(err.error, 'danger'); 
        }
      );

  }

}
