import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { FileUploader } from "angular-file";

import { ToastComponent } from '../../shared/toast/toast.component';
import { AuthService, ProfilesService } from '../../shared/services';
import { User } from '../../shared/models';
const URL = 'https://evening-anchorage-3159.herokuapp.com/api/';
@Component({
  selector: 'app-settings-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class SettingsProfileComponent {

 

}
