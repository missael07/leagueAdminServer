import { Controller, Post, Delete, UploadedFile, Query, UseInterceptors } from '@nestjs/common';
import { CustomValidationException } from 'src/common/utils/customValidation';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage, memoryStorage } from 'multer';
import { Auth } from '../decorators/auth.decorator';
import { FileUploadService } from '../services/file-upload/file-upload.service';
import { extname } from 'path';

@Controller('file-upload')
@Auth()
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Post('s3')
  @UseInterceptors(FileInterceptor('file', {
    storage: memoryStorage(),
    fileFilter: (req, file, callback) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png|pdf)$/)) {
        return callback(        
          new CustomValidationException([
            {
                property: 'file',
                constraints: {
                    'message': 'File must has one of the following extensions: jpg, pdf, png, jpge.'
                }
            }
        ]),
          false,
        );
      }
      callback(null, true);
    },
  }))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new CustomValidationException([
        {
          property: 'file',
          constraints: {
            'message': 'File is required and cannot be empty.'
          }
        }
      ]);
    }
    return await this.fileUploadService.uploadFile(file);
  }

}
