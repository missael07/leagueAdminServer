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
        cloud_name: process.env.CLOUD_NAME, 
        api_key: process.env.CLOUD_API_KEY, 
        api_secret: process.env.CLOUD_API_SECRET // Click 'View API Keys' above to copy your API secret
    });
  }

  async uploadFile(file: Express.Multer.File) {

    try {
        const fileName = file.originalname;
        const folder = `uploads`;
        const fileKey = `${folder}/${fileName}`;
        const cloudFolder = `${process.env.LEAGUE_NAME}/${process.env.NODE_ENV}`
        console.log(fileKey)
        const uploadResult = await cloudinary.uploader
        .upload(
            fileKey, {
                public_id: fileName,
                folder: cloudFolder
            }
        )
     
      return this.hresponseService.handleSuccess([], '', { fileKey: uploadResult.secure_url});
    } catch (error) {
      console.log(error);
      return this.hresponseService.handleExceptions('fileupld002', `Error uploading file: ${error.message}`);
    }
  }

}
