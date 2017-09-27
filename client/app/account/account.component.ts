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

  data: User;
  
  isLoading = true;

  usernameForm: FormGroup;
  username = new FormControl('', [Validators.required]);

  constructor(private auth: AuthService,
    private router: Router,
    private formBuilder: FormBuilder,
    public toast: ToastComponent) { }

  ngOnInit() {
    this.getUser();

    this.usernameForm = this.formBuilder.group({
      username: this.username
    });
  }

  getUser() {
    this.auth.currentUser.subscribe(
      (userData: User) => {
        this.data = userData;

      }
    );
  }

  submit() {
    this.auth.confirmUsername(this.data).subscribe(
      res =>  this.router.navigate(['/me']),
      error => console.log(error)
    );
  }

}
