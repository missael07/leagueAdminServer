import { Module } from '@nestjs/common';
import { ResponseHandlerService } from './handlers/respose.handler';
import { SendEmailService } from './services/email/sendEmail';
import { ConfigModule } from '@nestjs/config';
import { Role } from 'src/seed/entities/role.entity';
import { Menu } from 'src/seed/entities/menu.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  providers: [ResponseHandlerService, SendEmailService,],
  exports: [ResponseHandlerService, SendEmailService],
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Role, Menu]),
  ]
})
export class CommonModule {}