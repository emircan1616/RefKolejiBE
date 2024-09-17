import { IsString, IsNotEmpty, IsDateString, Length, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStudentDto {
  @ApiProperty({ example: 'Ali' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Veli' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: '12345678901' })
  @IsString()
  @Length(11, 11)
  @IsNotEmpty()
  tcNo: string;

  @ApiProperty({ example: '2005-05-15' })
  @IsDateString()
  @IsNotEmpty()
  birthDate: string;

  @ApiProperty({ example: '10' })
  @IsString()
  @IsNotEmpty()
  class: string;

  @ApiProperty({ example: 'A', required: false })
  @IsString()
  @IsOptional()
  section?: string;

  @ApiProperty({ example: 'Ahmet Hoca', required: false })
  @IsString()
  @IsOptional()
  mentor: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @IsOptional()
  studentPassword: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @IsOptional()
  parentPassword: string;

  @ApiProperty({ example: '47707893702' })
  @IsString()
  @Length(11, 11)
  @IsNotEmpty()
  parentTcNo: string;
}