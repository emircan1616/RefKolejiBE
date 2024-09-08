import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from 'src/Auth/Module/auth.module';
import { ProductModule } from 'src/Product/Module/product.module';



@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://emircan:emircan12345..@cluster0.kiijl.mongodb.net/'),
    AuthModule,
    ProductModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
