import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params, RouterLinkActive, NavigationEnd } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { 
  Profile,
  LabelService,
  StreamService
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

  public profile: Profile = new Profile();
  private urlPram: string;
  public userAuth: boolean;
  public currentTab:string;
  private subscription;

  constructor(
    private profileAuth: ProfileAuthService,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
    private labelService: LabelService,
    private streamService: StreamService
  ) { 
    
    route.params
      .subscribe(params=>{
         //Update profile data based on username
        this.profileAuth.populate(params.username);
      
      });

    const urlParam = route.snapshot.queryParams.label;

    if(urlParam){
      const domain = Utils.extractHost(urlParam);
      this.handleParams(urlParam, domain);
    }

  }

  ngOnInit(){ 

    this.profileAuth.currentProfile
      .subscribe(profile => {this.profile = profile;});

    this.profileAuth.isUserAuth
      .subscribe(auth => this.userAuth = auth);

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
    return this.labelService.searchByDomain({url: domain}).subscribe(
      data => { 

        if(data.error){
          this.router.navigate(['/' + this.profile.username])
        }

        const modalRef = this.modalService.open(LabelModalComponent, {size: 'lg', 'backdrop': 'static'});
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
