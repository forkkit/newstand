import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

import {NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

import { FlagService } from '../services';
import { Profile, Flag } from '../models';

import Utils from '../utils';

@Component({
  selector: 'app-flag-modal',
  templateUrl: './flag-modal.component.html',
  styleUrls: ['./flag-modal.component.scss']
})
export class FlagModalComponent implements OnInit {
  
  @Input() name;
  baseUrl: string;
  error: boolean = false;
  errorMessage: string;
  profile: Profile = new Profile();
  flag: Flag = new Flag();
  url:string;
  validArticle:boolean = false;
  section:string;
  labelOptions:string[] = ['source', 'details', 'correction', 'explaination', 'update'];
  activeLabel: string;


  flagForm: FormGroup;
  username = new FormControl('', [Validators.required]);
  

  constructor(
    public activeModal: NgbActiveModal,
    private flagService: FlagService,
    private fb: FormBuilder
  ){ 

    this.flagForm = fb.group({
      url: [''],
      section: [''],
      label: [''],
      description: [''],
      publisher: {
        username: [''],
        profile: ['']
      }
    });

  }

  ngOnInit(){ 
    this.flagForm.patchValue({
      url: this.url, 
      publisher: {
        username: this.profile.username,
        profile: this.profile._id
      }
    });
  }

  verifyDomain(url){ 

    //If input empty or baseUrl has not changed
    if(!url || url.indexOf(this.baseUrl) >= 0){
      return;
    }

    this.error = false;

    this.baseUrl = Utils.extractHost(url);

    return this.flagService.searchByDomain({url: this.baseUrl}).subscribe(
      data => {

        if(data.error){
          this.error = true;
          this.errorMessage = `${data.domain} does not appear to be tied to any account :(`;
        }

        this.profile = data;

        this.flagForm.patchValue({
          url: url,
          publisher: {
            username: data.username,
            profile: data._id
          }
        });

      },
      err => console.log(err)
    );
  }
  
  verifySection(text){
    
    //If textarea empty
    if(!text){
      return;
    }

    return this.flagService.verifySection({section: text, url: this.flagForm.value.url}).subscribe(
      result => {

       if(!result.valid){
        this.error = true;
        this.errorMessage = 'Unable to find text within article. Please try again.';
        return;
       }

       this.validArticle = true;

       this.section = text;

      },
      err => console.log(err)
    );
  }

  selectLabel(label){
    this.activeLabel = label;
    this.flagForm.patchValue({label: label});
  }

  submit(form){
    return this.flagService.create(form.value).subscribe(
      data => { 

        console.log(data);

      },
      err => console.log(err)
    );
  }

}
