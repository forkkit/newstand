import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { 
  LabelService,
  Label
} from '../../../shared';

@Component({
  selector: 'app-profile-flag-detail',
  templateUrl: './flag-detail.component.html',
  styleUrls: ['./flag-detail.component.scss']
})
export class ProfileFlagsDetailComponent implements OnInit {

  public label: Label = new Label(); 
  public respond: boolean = false;

  constructor(
    private labelService:LabelService,
    private route: ActivatedRoute
  ) { 
    
    const id: string = route.snapshot.params.id;

    labelService.getDetail(id)
      .subscribe(
        label => {this.label = label;},
        err => console.log(err)
      
      );

  }

  ngOnInit() {

  }


}
