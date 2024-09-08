import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { User, UserSchema } from 'src/Schemas/user.schema';
import { AuthService } from '../auth.service'; // AuthService yolunu kontrol edin
import { AuthController } from '../Controller/auth.Controller'; // AuthController yolunu kontrol edin
import { JwtAuthGuard } from '../Jwt/jwt-auth.guard'; // JwtAuthGuard veya ilgili guard

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      secret: 'yourSecretKey', // Gizli anahtarınızı burada belirleyin
      signOptions: { expiresIn: '60m' }, // Token geçerlilik süresi
    }),
  ],
  // providers: [JwtAuthGuard],
  // //controllers: [AuthController],
  // exports: [JwtAuthGuard, JwtModule],

  providers: [AuthService, JwtAuthGuard],
  controllers: [AuthController],
  exports: [AuthService, JwtAuthGuard, JwtModule],
})
export class AuthModule {}
