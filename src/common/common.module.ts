import { Module } from '@nestjs/common';
import { ResponseHandlerService } from './handlers/respose.handler';
import { SendEmailService } from './services/email/sendEmail';
import { ConfigModule } from '@nestjs/config';
import { Role } from 'src/seed/entities/role.entity';
import { Menu } from 'src/seed/entities/menu.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuController } from './controllers/menu.controller';
import { MenuService } from './services/menu/menu.service';
import { FileUploadController } from './controllers/upload-file.controller';
import { FileUploadService } from './services/file-upload/file-upload.service';

@Module({
  controllers: [MenuController, FileUploadController],
  providers: [ResponseHandlerService, SendEmailService, MenuService, FileUploadService],
  exports: [ResponseHandlerService, SendEmailService],
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Role, Menu]),
  ]
})
export class CommonModule {}