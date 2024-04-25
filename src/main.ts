import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './interceptors/transform.interceptor';
import { PrismaClientExceptionFilter } from './interceptors/notfoundPrisma.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true
  }))

  app.enableCors()
  app.useGlobalInterceptors(new ResponseInterceptor())
  app.useGlobalFilters(new PrismaClientExceptionFilter())
  await app.listen(3000);
}
bootstrap();
