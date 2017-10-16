import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

import { User } from '../models';
import { AuthService } from '../services';
import { LabelModalComponent } from '../label-modal/label-modal.component';


@Component({
  selector: 'layout-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

    currentUser: User = new User();
    closeResult: string;

    constructor(
        public auth: AuthService,
        private router: Router,
        private modalService: NgbModal
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

    open() {
        this.modalService.open(LabelModalComponent, {size: 'lg', 'backdrop': 'static'});
    }
    

}