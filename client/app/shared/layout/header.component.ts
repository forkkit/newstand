import { Component, OnInit, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { Router } from '@angular/router';

import { User } from '../models';
import { AuthService } from '../services';

@Component({
  selector: 'layout-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

    currentUser: User = new User();

    constructor(
        public auth: AuthService,
        private router: Router,
        private cdr: ChangeDetectorRef 
    ) {}

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

    // ngAfterViewChecked(): void {
	// 	this.cdr.detectChanges();
	// }

}