import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastComponent } from '../shared/toast/toast.component';
import { AuthService } from '../services/auth.service';

import { User } from '../services/user.model';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  currentUser: User;
  
  isLoading = true;

  usernameForm: FormGroup;
  username = new FormControl('', [Validators.required]);

  constructor(private auth: AuthService,
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
    this.auth
    .confirmUsername(this.currentUser)
    .subscribe(
      updatedUser => {
        this.router.navigate(['/me'])
      },
      err => {
        console.log(err);
      }
    );
  }

}
