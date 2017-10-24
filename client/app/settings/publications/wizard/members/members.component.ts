import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

import { ToastComponent } from '../../../../shared/toast/toast.component';
import { WizardService, WizardAuth } from '../services';
import { Profile, AuthService } from '../../../../shared';

@Component({
  selector: 'app-wizard-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss']
})
export class WizardMembersComponent implements OnInit {

  private profile: Profile = new Profile();
  public newUser = {
    email: '',
    role: 'author'
  }

  private subscription;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private wizardService: WizardService,
    private wizardAuth: WizardAuth,
    public toast: ToastComponent) { }
 
  ngOnInit() {
    
    this.subscription = this.wizardAuth.currentPublisher.subscribe(
      (results) => {
        this.profile = results;
      }
    );

  }
    
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  addUser(user){
    
    return this.wizardService.findMember(user.email).subscribe(
      data => {
        this.profile.publisher.members.push({
          profile: data._id,
          username:data.username, 
          role: user.role
        });

        this.newUser = { email: '', role: 'author' }
      },
      err => this.toast.setMessage(err.error, 'danger')
    );

  }

  removeUser(member){
    const members = this.profile.publisher.members;

    for(let i = 0; i < members.length; i++){
      if(members[i].username === member.username){
        this.profile.publisher.members.splice(i, 1);
      }
    }
  }

  submit(){

    return this.wizardService.members(this.profile._id, this.profile.publisher).subscribe(
      data => {
        this.wizardAuth.updatePublisher(data);
        this.router.navigate(['settings/publications/create/details', this.profile._id]);
      },
      err => this.toast.setMessage(err.error, 'danger')
    );

  }

}
