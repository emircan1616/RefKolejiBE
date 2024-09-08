import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'Kullanıcının e-posta adresi',
    example: 'user@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Kullanıcının şifresi',
    example: 'password123',
    minLength: 6,
  })
  @MinLength(6)
  @IsNotEmpty()
  password: string;
}
