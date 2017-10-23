import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

import {NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

import { LabelService } from '../services';
import { Profile, Label } from '../models';

import Utils from '../utils';

@Component({
  selector: 'app-label-modal',
  templateUrl: './label-modal.component.html',
  styleUrls: ['./label-modal.component.scss']
})
export class LabelModalComponent implements OnInit {
  
  @Input() name;
  baseUrl: string;
  error: boolean = false;
  errorMessage: string;
  profile: Profile = new Profile();
  label: Label = new Label();
  url:string;
  validArticle:boolean = false;
  section:string;
  labelOptions:string[] = ['source', 'details', 'correction', 'explaination'];
  activeLabel: string;


  labelForm: FormGroup;
  username = new FormControl('', [Validators.required]);
  

  constructor(
    public activeModal: NgbActiveModal,
    private labelService: LabelService,
    private fb: FormBuilder
  ){ 

    this.labelForm = fb.group({
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
    this.labelForm.patchValue({
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

    return this.labelService.searchByDomain({url: this.baseUrl}).subscribe(
      data => {

        if(data.error){
          this.error = true;
          this.errorMessage = `${data.domain} does not appear to be tied to any account :(`;
        }

        this.profile = data;

        this.labelForm.patchValue({
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

    return this.labelService.verifySection({section: text, url: this.labelForm.value.url}).subscribe(
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
    this.labelForm.patchValue({label: label});
  }

  submit(form){
    return this.labelService.create(form.value).subscribe(
      data => { 

        console.log(data);

      },
      err => console.log(err)
    );
  }

}
