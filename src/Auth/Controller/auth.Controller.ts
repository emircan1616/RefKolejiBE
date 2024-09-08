import { Controller, Post,UseGuards, Body, ValidationPipe, Req, Res, BadRequestException, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { AuthService } from 'src/Auth/auth.service';
import { CreateUserDto } from 'src/Auth/Dto/create-user.dto';
import { LoginDto } from 'src/Auth/Dto/login.dto';
import { ApiTags, ApiBody, ApiResponse, ApiBearerAuth  } from '@nestjs/swagger';
import { Request as ExpressRequest, Response as ExpressResponse } from 'express';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  
  @ApiBody({
    description: 'Kullanıcı girişi için gerekli veriler',
    type: LoginDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Giriş işlemi başarılı',
    schema: {
      example: {
        message: 'Giriş işlemi başarılı',
        data: {
          access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          user: {
            userId: '60d21b4667d0d8992e610c85',
            email: 'user@example.com',
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Yetkisiz. Geçersiz e-posta veya şifre.',
    schema: {
      example: {
        statusCode: 401,
        message: 'Geçersiz e-posta veya şifre',
        error: 'Unauthorized',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Sunucu hatası. Giriş işlemi sırasında bir hata oluştu.',
    schema: {
      example: {
        statusCode: 500,
        message: 'Giriş işlemi sırasında bir hata oluştu.',
        error: 'Internal Server Error',
      },
    },
  })
  @Post('login')
  async login(@Req() req: ExpressRequest, @Body() loginDto: LoginDto): Promise<any> {
    try {
      const result = await this.authService.login(req, loginDto.email, loginDto.password);
      console.log('sesion susccessfull') 
      return { message: 'Giriş işlemi başarılı', data: result };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw new UnauthorizedException(error.message);
      }
      throw new InternalServerErrorException(error);
    }
  }
  
  @ApiBody({
    description: 'Yeni bir kullanıcı oluşturmak için gerekli veriler',
    type: CreateUserDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Kullanıcı başarıyla oluşturuldu.',
    schema: {
      example: {
        message: 'Kullanıcı başarıyla oluşturuldu.',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Geçersiz giriş. Kullanıcı oluşturulamadı.',
    schema: {
      example: {
        statusCode: 400,
        message: 'Detaylı hata mesajı.',
        error: 'Bad Request',
      },
    },
  })
  @Post('signup')
  async postSignup(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
    try {
      await this.authService.createUser(createUserDto.email, createUserDto.password);
      return { message: 'Kullanıcı başarıyla oluşturuldu.' };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
 
