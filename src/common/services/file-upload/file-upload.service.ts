import { Injectable } from '@nestjs/common';
import { ResponseHandlerService } from 'src/common/handlers/respose.handler';
import { v2 as cloudinary } from 'cloudinary';
import path from 'path';

@Injectable()
export class FileUploadService {

  constructor(
    private readonly hresponseService: ResponseHandlerService
  ) {
    cloudinary.config({ 
        cloud_name: 'dbmznxfot', 
        api_key: '828997914913782', 
        api_secret: 'bzVtFR5UCD4oSmAGKK0JcEvzZp0' // Click 'View API Keys' above to copy your API secret
    });
  }

  async uploadFile(file: Express.Multer.File) {

    try {
        const fileName = file.originalname;
        const folder = `uploads`;
        const fileKey = `${folder}/${fileName}`;
        const uploadResult = await cloudinary.uploader
        .upload(
            fileKey, {
                public_id: fileName,
            }
        )
     
      return this.hresponseService.handleSuccess([], '', { fileKey: uploadResult.secure_url});
    } catch (error) {
      return this.hresponseService.handleExceptions('fileupld002', `Error uploading file: ${error.message}`);
    }
  }

}
