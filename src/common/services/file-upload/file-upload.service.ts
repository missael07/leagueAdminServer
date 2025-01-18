import { Injectable } from '@nestjs/common';
import { ResponseHandlerService } from 'src/common/handlers/respose.handler';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
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

  private async _uploadFile(file: Express.Multer.File, folder: string, public_id: string) {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder, public_id, resource_type: 'auto' },
        (error, result) => {
          return error ? reject(error) : resolve(result)
        },
      ).end(file.buffer);
    });
  }
  async uploadFile(file: Express.Multer.File) {

    try {
      const fileName = file.originalname;
      const cloudFolder = `${process.env.LEAGUE_NAME}/${process.env.NODE_ENV}`
      const uploadResult = <UploadApiResponse>await this._uploadFile(file, cloudFolder, fileName);
      console.log(uploadResult);
      return this.hresponseService.handleSuccess([], '', { fileKey: uploadResult.secure_url });
    } catch (error) {
      console.log(error);
      return this.hresponseService.handleExceptions('fileupld002', `Error uploading file: ${error.message}`);
    }
  }

}
