import { Component, Input, Output, EventEmitter } from '@angular/core';

import { ProfilesService } from '../services/profiles.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent{

  @Input() image: string;
  @Output() path: EventEmitter<string> = new EventEmitter<string>();;
  public tempImage: string;
  public isLoading: boolean = false;

  constructor(private profilesService: ProfilesService){ }

  
  upload(input:any){ 

    this.isLoading = true;

    let fileCount: number = input.target.files.length;
    let formData = new FormData();

    if (fileCount > 0) {
      
      formData.append('photo', input.target.files.item(0));

      this.profilesService.upload(formData)
        .subscribe(
          data => {
            this.path.emit(data);
            this.isLoading = false;
          },
          err => {
            console.log(err);
          }
        );
    }
  }

}
