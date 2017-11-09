import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';

import { 
  Profile,
  FlagService
} from '../../../shared';

import { 
  ProfileAuthService
} from '../../services';

@Component({
  selector: 'app-profile-flags',
  templateUrl: './flags.component.html',
  styleUrls: ['./flags.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProfileFlagsComponent implements OnInit {

  public profile: Profile = new Profile(); 
  private subscription;
  private flags:any;
  private search:string;
  private currentParams:string;
  private queryParams:string;
  private page:number = 1;
  public filter: Array<string> = ['status', 'label', 'url', 'user'];
  private paramsCheck: Array<string> = [];

  constructor(
    private profileAuth: ProfileAuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private flagService:FlagService
  ) { 
     
  }

  ngOnInit() {

    this.subscription = this.activatedRoute.queryParams
      .switchMap((params) => {
       
        this.currentParams = params.q;
        this.queryParams = this.buildQuery(params.q);
        
        if(params.p){this.page = params.p;}

        return this.profileAuth.currentProfile;
      })
      .skipWhile(profile => { return !profile._id; })
      .switchMap((profile) => {
        this.profile = profile;
        return this.flagService.get(profile._id, this.page, this.queryParams);
      }) 
      .subscribe(flags => {
          
        this.flags = flags;

      },
      err => console.log(err));
      
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  buildQuery(params){ 
    let query = '';

    if(params){
      //Remove white space around colon
      const condense = params.replace(/\s*([\:])\s*/g, '$1');
      //Split at space to form array
      const paramsArray = condense.split(' ');
      for (var i = 0; i < paramsArray.length; i++) {
        let split = paramsArray[i].split(/:(.+)/);
        let key = split[0].toLowerCase();
        this.paramsCheck.push(key);
        query += key + "=" + split[1];
        query += (i < (paramsArray.length -1)) ? "&" : "";
      }
    }

    this.search =  (this.paramsCheck.indexOf('status') === -1) ? 'status:all ' + params : params;
   
    return query;
  }

  searchFlag(event){
    return this.router.navigate(['/' + this.profile.username + '/flags'], 
      { queryParams: 
        { q: event.target.value, p: this.page } 
      }
    );
  }
  
  changeFilter(filter, el){
    
    if(this.paramsCheck.indexOf(filter) === -1){
      this.search = this.search + ' ' + filter + ': ';
      el.focus();
    }
    
  }

  pageChange(event: number){
    this.router.navigate(['/' + this.profile.username + '/flags'], 
      { queryParams: 
        { q: this.currentParams, p: this.page } 
      }
    );
  }


}
