import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from '../auth.service';
import { AuthController } from '../Controller/auth.Controller';
import { JwtAuthGuard } from './jwt-auth.guard';

@Module({
  imports: [
    JwtModule.register({
      secret: 'yourSecretKey',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [JwtAuthGuard],
  controllers: [JwtAuthGuard, JwtModule],
})
export class AuthModule {}
