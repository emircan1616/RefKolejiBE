import { IsString, IsNotEmpty, IsDateString, Length, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class StudentLoginDto {
  @ApiProperty({ example: '12345678901' })
  @IsString()
  @Length(11, 11)
  @IsNotEmpty()
  tcNo: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @IsOptional()
  studentPassword: string;
}