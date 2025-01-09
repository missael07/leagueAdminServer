
import { Injectable, Logger } from '@nestjs/common';
import { readFileSync } from "fs";
import { join } from "path";
import * as nodemailer from 'nodemailer';
import * as Handlebars from 'handlebars';
import { ResponseHandlerService } from 'src/common/handlers/respose.handler';


@Injectable()
export class SendEmailService {
  constructor(private readonly errorHandlerService: ResponseHandlerService) {
    errorHandlerService.logger = new Logger('SendEmailService');
  }

  private _getTemplate(templateName: string): string {
    try {

      const templatePath = join('dist', 'templates', `${templateName}-template.hbs`);
      return readFileSync(templatePath, 'utf-8');
    } catch (error) {
      this.errorHandlerService.handleExceptions('getTemp001', error.message);
    }
  }


  private _compileTemplate(templateName: string, context: any): string {
    const templateSource = this._getTemplate(templateName);
    const template = Handlebars.compile(templateSource);
    return template(context);
  }

  async sendEmail(email: string, context: any, template: string, subject: string) {

    const html = this._compileTemplate(template, context);
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.USER,
          pass: process.env.PASS,
        },
      });

      const mailOptions = {
        from: process.env.FROM,
        to: email,
        subject,
        html,
      };

      await transporter.sendMail(mailOptions);

      return 'Email sent successfully.';
    } catch (error) {
      this.errorHandlerService.handleExceptions('aurecover000', error.detail);
    }

  }
}




