import { Component, ViewEncapsulation, OnInit, Input, Output, EventEmitter  } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';

import { 
  Profile,
  FlagService,
  Flag,
  Activity
} from '../../../shared';

@Component({
  selector: 'app-flag-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FlagCommentComponent implements OnInit{

  @Input() flag: Flag = new Flag();
  @Input() user: Profile = new Profile();;
  @Output() saved: EventEmitter<Flag> = new EventEmitter<Flag>();

  public activity: Activity = new Activity(); 
  
  public addressOptions: any = {
    'details' : [{ title: 'Add detail', value: 'add_detail', error: 'Address flag by adding required details in comment field'}],
    'source' : [{ title: 'Add source', value: 'add_source', error: 'Address flag by adding required source details' }],
    'update' : [],
    'correction' : [],
    'subjective' : [],
  }

  public badgeOptions: Array<string> = ['credit', 'helpful', ''];
  public activityForm: FormGroup;
  public submitted: boolean;
  public addressPlaceholder: string;
  public sourcePlaceholder: string;

  constructor(
    private flagService:FlagService,
    private _fb: FormBuilder
  ) {

    this.activityForm = _fb.group({
      user: {
        role: ['']
      },
      flag: ['', <any>Validators.required],
      type: [''],
      address: _fb.group({
        label: [''],
        meta: _fb.array([])
      }),
      comment: ['', <any>Validators.required]
    });

  }

  ngOnInit(){
    this.activityForm.patchValue({
      user: {role:this.user.role},
      flag: this.flag._id,
      type: 'comment'
    });
  }

  address(event){

    this.addressPlaceholder = (event.target.value) ? 'Do not address flag' : 'Address flag';

    this.activityForm.patchValue({
      address: { label: event.target.value },
      type: (event.target.value ? 'address' : 'comment') 
    });

    let comment = this.activityForm.controls["comment"];

    if(event.target.value === 'add_source'){

      const addressArray = <FormArray>this.activityForm.get('address.meta');
      const source = this._fb.group({
        type: new FormControl('',<any>Validators.required),
        detail: new FormControl('',<any>Validators.required)
      });
  
      addressArray.push(source);
      comment.setValidators(null);
      
    }else{
      (<FormArray>this.activityForm.get('address.meta')).removeAt(0);
      comment.setValidators([Validators.required]);
    }

    comment.updateValueAndValidity();
  }

  source(event){
    
    const placeholders = {
      'digital': 'Enter source URL',
      'print': 'Enter print publication details',
      'person': 'Enter person name'
    }

    this.sourcePlaceholder = placeholders[event.target.value];

  }


  submit(model: Flag, isValid: boolean){

    this.submitted = true;

    if(isValid){

      return this.flagService.activity(model).subscribe(
        data => { 
          
          this.saved.emit(data);
          this.activity = new Activity();

        },
        err => console.log(err)
      );

    }

  }


}
