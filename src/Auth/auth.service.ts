import { Injectable, BadRequestException, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/Schemas/user.schema';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly jwtService: JwtService
  ) {}

  async findByEmail(userName: string): Promise<User | null> {
    return this.userModel.findOne({ userName }).exec();
  }

  async createUser(email: string, password: string): Promise<User> {
    const existingUser = await this.findByEmail(email);
    if (existingUser) {
      throw new BadRequestException('E-Mail zaten kullanılıyor. Lütfen başka bir e-posta adresi seçin.');
    }
    try {
      const hashedPassword = await bcrypt.hash(password, 12);
      const user = new this.userModel({
        email,
        password: hashedPassword
      });
      return await user.save();
    } catch (error) {
      throw new BadRequestException('Kullanıcı oluşturulurken hata.');
    }
  }

  async login(req: Request, userName: string, password: string): Promise<any> {
    try {
      const user = await this.userModel.findOne({ userName }).exec();
      if (!user) {
        throw new UnauthorizedException('Hatalı kullanıcı adı.');
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new UnauthorizedException('Hatalı Şifre.');
      }

      const payload = { userId: user._id, userName: user.userName };
      const accessToken = this.jwtService.sign(payload);

      req.session.user = {
        userId: user._id.toString(),
        userName: user.userName,
      };
        console.log('sesion started') 
      return {
        access_token: accessToken,
        user: {
          userId: user._id,
          user: user.userName          
        }
      };
    } catch (error) {
      throw new InternalServerErrorException('Giriş işlemi sırasında bir hata oluştu.');
    }
  }
}
