import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { 
  Profile,
  LabelService 
} from '../shared';

import { 
  ProfileAuthService,
} from './services';

import { LabelModalComponent } from '../shared/label-modal/label-modal.component';

import Utils from '../shared/utils';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit{

  private subscription;
  public profile: Profile = new Profile();
  private urlPram: string;

  constructor(
    private profileAuth: ProfileAuthService,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
    private labelService: LabelService
  ) { }

  ngOnInit(){

    //Update profile data based on username
    this.route.params
      .subscribe(params=>{this.profileAuth.populate(params.username)})
    
    this.subscription = this.profileAuth.currentProfile
      .subscribe(profile => this.profile = profile);

    this.urlPram = this.route.snapshot.queryParams.label;

    if(this.urlPram){
      const domain = Utils.extractHost(this.urlPram);
      this.handleParams(domain);
    }

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  handleParams(domain){
    return this.labelService.searchByDomain({url: domain}).subscribe(
      data => { 

        if(data.error){
          this.router.navigate(['/' + this.profile.username])
        }

        const modalRef = this.modalService.open(LabelModalComponent, {size: 'lg', 'backdrop': 'static'});
        modalRef.componentInstance.url = this.urlPram;
        modalRef.componentInstance.profile = data;
        
      },
      err => console.log(err)
    );
  }
}
