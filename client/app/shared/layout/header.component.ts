import { Component, OnInit, ViewContainerRef, Inject, ViewChild, ComponentRef, ComponentFactoryResolver } from '@angular/core';
import { Router } from '@angular/router';

import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

import { Profile } from '../models';
import { AuthService } from '../services';
import { FlagModalComponent } from '../flag-modal/flag-modal.component';
import { NotificationsSharedComponent } from '../notifications';

@Component({
  selector: 'layout-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

    currentUser: Profile = new Profile();
    closeResult: string;

    @ViewChild('notifications', {read: ViewContainerRef}) target: ViewContainerRef;
    private componentRef: ComponentRef<any>;

    constructor(
        public auth: AuthService,
        private router: Router,
        private modalService: NgbModal,
        private componentFactoryResolver: ComponentFactoryResolver
    ) {
    }

    ngOnInit() {
        this.auth.currentUser.subscribe(
            (userData) => this.currentUser = userData
        )
    }

    logout(){
        this.auth.logout();
        this.router.navigateByUrl('/'); 
    }

    open() {
        this.modalService.open(FlagModalComponent, {size: 'lg', 'backdrop': 'static'});
    }

    openNotifications(event){ 
        if(event){
            let childComponent = this.componentFactoryResolver.resolveComponentFactory(NotificationsSharedComponent);
            this.componentRef = this.target.createComponent(childComponent);
            
            this.currentUser.unseen = 0;
            this.auth.update(this.currentUser);
        }else{
            this.target.clear();
        }
    }
    

}