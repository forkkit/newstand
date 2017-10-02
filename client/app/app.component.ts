import { Component } from '@angular/core';

import { AuthService } from './shared/services/';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent{
  
  constructor(
    public auth: AuthService
  ) { 
    this.auth.populate();
  }
  
}
