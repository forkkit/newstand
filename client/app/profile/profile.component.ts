import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params, RouterLinkActive, NavigationEnd } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { 
  Profile,
  FlagService,
  StreamService
} from '../shared';

import { 
  ProfileAuthService,
} from './services';

import { FlagModalComponent } from '../shared/flag-modal/flag-modal.component';

import Utils from '../shared/utils';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit{

  public profile: Profile = new Profile();
  private urlPram: string;
  public currentTab:string;
  private subscription;
  private switchView:boolean = false;

  constructor(
    private profileAuth: ProfileAuthService,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
    private flagService: FlagService,
    private streamService: StreamService
  ) { 

    const urlParam = route.snapshot.queryParams.label;

    if(urlParam){
      const domain = Utils.extractHost(urlParam);
      this.handleParams(urlParam, domain);
    }

  }

  ngOnInit(){ 

    this.profileAuth.currentProfile
      .subscribe(profile => {
        this.switchView = true;
        this.profile = profile;
      });

    //Hack to keep current tab active
    this.activeRoute();
    this.subscription = this.router.events
      .subscribe((event) => {
        if(event instanceof NavigationEnd) {

          this.activeRoute();
          
        }
      }
    );

  }

  activeRoute(){
    const snapshot = this.route.firstChild.snapshot;
    if(snapshot)
    this.currentTab = snapshot.data.page; 
  }

  handleParams(urlParam, domain){
    return this.flagService.searchByDomain({url: domain}).subscribe(
      data => { 

        if(data.error){
          this.router.navigate(['/' + this.profile.username])
        }

        const modalRef = this.modalService.open(FlagModalComponent, {size: 'lg', 'backdrop': 'static'});
        modalRef.componentInstance.url = urlParam;
        modalRef.componentInstance.profile = data;
        
      },
      err => console.log(err)
    );
  }


  follow(id){
    this.streamService.follow({target: id})
      .subscribe(follow => {this.profile.follow = true});
  }


  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
