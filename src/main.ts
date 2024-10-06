import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AllExceptionsFilter } from './core/common/error_handler'; 
const session = require('express-session');
const MongoStore = require('connect-mongo');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Ekin Smart City Basic API Doc')
    .setDescription('')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  app.enableCors({
    origin: 'http://localhost:3005',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: 'Content-Type, Authorization',
  });

  // Create an instance of MongoStore
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

  // Apply global exception filter
  app.useGlobalFilters(new AllExceptionsFilter());

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    customCssUrl: '../swagger-dark-theme.css',
  });

  await app.listen(3004);
}
bootstrap();