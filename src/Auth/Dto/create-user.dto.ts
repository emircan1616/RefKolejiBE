import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'Kullanıcının e-posta adresi',
    example: 'newuser@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Kullanıcının şifresi',
    example: 'securepassword',
    minLength: 6,
  })
  @MinLength(6)
  @IsNotEmpty()
  password: string;
}
