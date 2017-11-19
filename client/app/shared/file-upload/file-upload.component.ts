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
  public error: string;

  constructor(private profilesService: ProfilesService){ }

  
  upload(input:any){ 

    this.error = '';
    const files = input.target.files;
    let formData = new FormData();

    //Exists
    if(files.length === 0) {
      this.error = 'Error: Image not found';
      return;
    }

    //Size (< 1mb)
    if(files[0].size > 1000000){
      this.error = 'Error: Image exceeds maximum file size of 1 mb';
      return;
    }

    //Type
    const name = files[0].name;
    const extenstion = name.substring(name.lastIndexOf('.') + 1).toLowerCase();

    if (extenstion !== "gif" && extenstion !== "png"
    && extenstion !== "jpeg" && extenstion !== "jpg") {
      this.error = 'Error: Image must be a PNG, JPG, or GIF file';
      return;
    }

    this.isLoading = true;
      
    formData.append('photo', files.item(0));

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
