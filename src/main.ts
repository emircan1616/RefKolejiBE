import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
//import session from 'express-session';
const session = require('express-session');
//import MongoStore from 'connect-mongo';
const MongoStore = require('connect-mongo');
// import { JwtAuthGuard } from './Auth/Jwt/jwt-auth.guard';
// import { Reflector } from '@nestjs/core';
// import { JwtService } from '@nestjs/jwt';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Ekin Smart City Basic API Doc')
    .setDescription('')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

    app.enableCors({
      origin: 'http://localhost:3000/',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      allowedHeaders: 'Content-Type, Authorization',
    });


  //Create an instance of MongoStore
  const mongoStore = MongoStore.create({
    mongoUrl: 'mongodb+srv://emircan:emircan12345..@cluster0.kiijl.mongodb.net/',
    collectionName: 'sessions',
  });

  app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    store: mongoStore,
    cookie: { secure: false },
  }));

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('', app, document, {
    customCssUrl: '../swagger-dark-theme.css',
  });

  await app.listen(3000);
}
bootstrap();
