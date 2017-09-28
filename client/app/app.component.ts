import { Component, ChangeDetectorRef, AfterViewChecked, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from './services/auth.service';

import { User } from './services/user.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  currentUser: User = new User();

  constructor(
    public auth: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef  
  ) { 
    
    this.auth.populate();

  }

  ngOnInit() {
    this.auth.currentUser.subscribe(
      (userData) => {
        this.currentUser = userData;
      }
    )
  }

  logout(){
    this.auth.logout();
    this.router.navigateByUrl('/'); 
  }

  ngAfterViewChecked(): void {
		this.cdr.detectChanges();
	}

}
