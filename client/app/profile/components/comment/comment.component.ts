import { Component, ViewEncapsulation, OnInit, Input, Output, EventEmitter  } from '@angular/core';

import { 
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
  @Input() role: string;
  @Output() saved: EventEmitter<Flag> = new EventEmitter<Flag>();

  public activity: Activity = new Activity(); 

  constructor(
    private flagService:FlagService
  ) {}

  ngOnInit(){
    this.activity = {
      user: {role:this.role},
      flag: this.flag._id
    };
  }

  checkbox(e, action) {

    let isChecked = e.target.checked;
    const type = (action === 'raise') ? 'address' : 'reraise';

    this.activity.type = (isChecked) ? type : '';

  }

  submit(){

    return this.flagService.activity(this.activity).subscribe(
      data => { 
        
        this.saved.emit(data);
        this.activity = new Activity();

      },
      err => console.log(err)
    );

  }


}
