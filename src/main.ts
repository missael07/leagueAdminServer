import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { CustomValidationExceptionFilter } from './common/utils/customValidationFilter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = new Logger('Bootstrap');

  app.setGlobalPrefix('api');
  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    })
   );

   app.useGlobalFilters(new CustomValidationExceptionFilter());

  await app.listen(process.env.PORT ?? 3000);
  logger.log(`App running in ${await app.getUrl()}`);
}
bootstrap();
