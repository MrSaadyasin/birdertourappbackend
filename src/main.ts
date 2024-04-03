import { NestFactory } from '@nestjs/core';
import { RootModule } from './root.module';
import * as cookieParser from 'cookie-parser';



async function bootstrap() {
  const Port = process.env.PORT
  const app = await NestFactory.create(RootModule)
  // const app = await NestFactory.create(RootModule, {cors: true})
  app.enableCors({
    origin: true, // reflects the request origin, OR specify your allowed domains
    credentials: true,
  })
  //  app.enableCors({
  //   origin : [process.env.APP_URL, process.env.APP_VENDOR_URL],
  //   credentials: true,
  //  })

  app.use(cookieParser());

  await app.listen(Port);
  console.log(`Server is running on the port ${Port}`)
}
bootstrap();
