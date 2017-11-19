import {Router, Request, Response, NextFunction} from 'express';

import * as multiparty from 'multiparty';
import * as uuidv1 from 'uuid/v1';
import * as s3 from 's3';
import * as AWS from 'aws-sdk';

import config from '../../config';
import * as auth from '../../auth/auth.service';
import Profile from '../../models/profile';

import { userRequest } from "../../config/definitions";

const awsS3Client = new AWS.S3(config.s3);
const client = s3.createClient({s3Client: awsS3Client});

export class UploadRouter{
  router: Router
  model = Profile;

  constructor() {
    this.router = Router();
    this.routes();
  }

  private upload = (req: userRequest, res: Response) =>  {
    
    let form = new multiparty.Form();

    form.parse(req, function(err, fields, files) {

      let file = files.photo[0]; 
      let extension = file.path.substring(file.path.lastIndexOf('.'));
      let destPath =  uuidv1() + extension;
  
      const uploader = client.uploadFile({
        localFile: file.path,
        s3Params: {
          Bucket: config.s3.bucket,
          Key: destPath,
          ACL:'public-read'
        },
      });

      uploader.on('error', function(err) {
        console.log(err);
        res.json({error: 'Image upload failed. Try again.'});
      });
  
      uploader.on('end', function(url) { console.log(url);
  
        var imgPath = 'https://s3.amazonaws.com/' + config.s3.bucket+ '/' + destPath;
        
        res.json({path: imgPath});
  
      });

    });

  }


  routes() {
    this.router.post('/', auth.isAuthenticated(), this.upload);
  }

}

const router = new UploadRouter().router;
export default router;