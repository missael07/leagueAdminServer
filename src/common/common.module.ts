import { Module } from '@nestjs/common';
import { ResponseHandlerService } from './handlers/respose.handler';
import { SendEmailService } from './services/email/sendEmail';

@Module({
  providers: [ResponseHandlerService, SendEmailService,],
  exports: [ResponseHandlerService, SendEmailService],
})
export class CommonModule {}