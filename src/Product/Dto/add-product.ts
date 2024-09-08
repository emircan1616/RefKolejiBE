import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({
    description: 'Ürünün başlığı',
    example: 'Yeni Ürün Başlığı',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Ürünün fiyatı',
    example: 150,
  })
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty({
    description: 'Ürünün açıklaması',
    example: 'Bu ürünün açıklaması güncellenmiştir.',
  })
  @IsNotEmpty()
  @IsString()
  description: string;
}
