import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { AuthService } from '../../shared/services';
import { ToastComponent } from '../../shared/toast/toast.component';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  errors = {};

  registerForm: FormGroup;

  email = new FormControl('', [Validators.required,
                               Validators.minLength(3),
                               Validators.pattern("[^ @]*@[^ @]*")]);
  password = new FormControl('', [Validators.required,
                               Validators.minLength(8)]); 
  
  passwordConfirm = new FormControl('', [Validators.required,
                               Validators.minLength(8)]);                                  
                                                           

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              public toast: ToastComponent,
              private auth: AuthService) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      email: this.email,
      password: this.password,
      passwordConfirm: this.passwordConfirm
    },
      {
        validator: this.passwordMatch
    });
  }

  passwordMatch(g: FormGroup) {
    return g.get('password').value === g.get('passwordConfirm').value
       ? null : { 'mismatch': true };
   }
 
  setClassEmail() {
    return (!this.email.pristine && !this.email.valid) ? 'Enter valid email address' : false;
  }

  setClassPassword() {
    return (!this.password.pristine && !this.password.valid) ? 'Password must be a minimum of 8 characters' : false;
  }

  setClassConfirm() { 
    return (!this.passwordConfirm.pristine && !this.passwordConfirm.valid ||
    !this.passwordConfirm.pristine && this.registerForm.errors && this.registerForm.errors.mismatch) ? 'Passwords must match' :false;
  }

  register() {
    this.auth.register(this.registerForm.value).subscribe(
      res => {
        this.router.navigate(['/settings/setup']);
        this.toast.setMessage('you successfully registered!', 'success'); 
      },
      (err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          // Client-side error
          this.toast.setMessage(err.error.message, 'danger'); 
        } else {
          this.toast.setMessage(err.error, 'danger'); 
        }
      }
    );
  }
}
