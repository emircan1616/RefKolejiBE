import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'Kullanıcının kullanıcı adı',
    example: 'emircan1616',
  })
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: 'Kullanıcının şifresi',
    example: 'securepassword',
    minLength: 6,
  })
  @MinLength(6)
  @IsNotEmpty()
  password: string;
}
