import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReversePipe } from 'ngx-pipes/src/app/pipes/array/reverse';

import { Profile, ProfilesService } from '../../shared';

@Component({
  selector: 'app-settings-publications',
  templateUrl: './publications.component.html',
  styleUrls: ['./publications.component.scss'],
  providers: [ReversePipe]
})
export class SettingsPublicationsComponent implements OnInit { 

  profiles: Profile[];
  statusArray: string[];

  constructor(
    private router: Router,
    private profilesService: ProfilesService, 
    private reverse: ReversePipe
  ) { 

    this.statusArray = ['members', 'details'];

  }

  ngOnInit() {

    this.profilesService.getAll().subscribe(
      data => {
        this.profiles = this.reverse.transform(data);
      },
      err => console.log(err)
    );
    
  }

  route(profile){

    

  }

  goToProfile(profile){

    // Redirect to publisher page if complete
    if(profile.publisher.status === 2){
      this.router.navigate(['/', profile.username]);
      return;
    }

    // Redirect to current step
    this.router.navigate(['/settings/publications/create/' + this.statusArray[profile.publisher.status] + '/' + profile._id]);    

  }

}
