  import { Controller, Post, Get, Body, UsePipes, ValidationPipe, UseGuards, Req } from '@nestjs/common';
  import { Request } from 'express';
  import { ProductService } from '../product.service';
  import { CreateProductDto } from '../Dto/add-product';
  import { ApiTags, ApiBody, ApiResponse } from '@nestjs/swagger';
  import { JwtAuthGuard } from 'src/Auth/Jwt/jwt-auth.guard';

  @ApiTags('Product')
  @Controller('products')
  export class ProductController {
    constructor(private readonly productService: ProductService) {}
    
    @UseGuards(JwtAuthGuard)
    @Post('protected-route')
    async protectedRoute(@Req() req: Request) {
      return { message: 'Bu route JWT doğrulaması gerektirir', user: req.user };
    }


    @ApiBody({
      description: 'Yeni bir ürün eklemek için gerekli veriler',
      type: CreateProductDto,
    })
    @ApiResponse({
      status: 201,
      description: 'Ürün başarıyla eklendi.',
      schema: {
        example: {
          message: 'Ürün başarıyla eklendi.',
          product: {
            id: '60d21b4667d0d8992e610c85',
            title: 'Yeni Ürün',
            price: 100,
            description: 'Bu, yeni bir ürünün açıklamasıdır.',
            createDate: '25/08/2024 03:26AM',
          },
        },
      },
    })
    @ApiResponse({
      status: 500,
      description: 'Ürün eklerken bir hata oluştu.',
      schema: {
        example: {
          message: 'Ürün eklerken bir hata oluştu.',
          error: 'Detaylı hata mesajı.',
        },
      },
    })
    @Post('add')
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true }))
    async addProduct(@Body() createProductDto: CreateProductDto){
        try {
        const product = await this.productService.addProduct(createProductDto);
        return{
          message: 'Ürün başarıyla eklendi.',
          product: product,
         };
        }
       catch (error) {
        return {
          message: 'Ürün eklerken bir hata oluştu.',
          error: error
        };
      }
    }

    @ApiResponse({
      status: 200,
      description: 'Tüm ürünler başarıyla listelendi.',
      schema: {
        example: {
          message: 'Tüm ürünler listelendi',
          product: [
            {
              id: '60d21b4667d0d8992e610c85',
              title: 'Ürün Başlığı',
              price: 100,
              description: 'Ürün açıklaması',
              createDate: '25/08/2024 03:26AM',
            },
          ],
        },
      },
    })
    @ApiResponse({
      status: 500,
      description: 'Ürünler listelenirken bir hata oluştu.',
      schema: {
        example: {
          message: 'Ürünler listelenirken bir hata oluştu.',
          error: 'Detaylı hata mesajı.',
        },
      },
    })
    @Get('/fetch')
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true }))
  async getProducts() {
    try {
      const products = await this.productService.getProducts();
      console.log(products);
      return{
        message: 'Tüm ürünler listelendi',
        product: products,
       };
    } 
    catch (error) {
        return {
          message: 'ürünler listelenirken bir hata oluştu.',
          error: error
        };
      }
    }

    @ApiBody({
      description: 'Parametre olarak verilen IDye sahip bir ürün varsa ürünün özelliklerini günceller.',
      schema: {
        type: 'object',
        properties: {
          prodId: {
            type: 'string',
            example: '60d21b4667d0d8992e610c85',
            description: 'Güncellenecek ürünün IDsi'
          },
          title: {
            type: 'string',
            example: 'Yeni Ürün Başlığı',
            description: 'Ürünün yeni başlığı'
          },
          price: {
            type: 'number',
            example: 150,
            description: 'Ürünün yeni fiyatı'
          },
          description: {
            type: 'string',
            example: 'Bu ürünün açıklaması güncellenmiştir.',
            description: 'Ürünün yeni açıklaması'
          }
        }
      }
    })
    @ApiResponse({
      status: 200,
      description: 'Ürün başarıyla güncellendi.',
      schema: {
        example: {
          message: '60d21b4667d0d8992e610c85 ID li Ürün başarıyla güncellendi.'
        }
      }
    })
    @ApiResponse({
      status: 500,
      description: 'Internal server error',
      schema: {
        example: {
          message: 'Ürünü güncelleme işlemi sırasında bir hata oluştu.',
          error: 'Detaylı hata mesajı.'
        }
      }
    })
      @Post('/edit')
      @UseGuards(JwtAuthGuard)
      @UsePipes(new ValidationPipe({ whitelist: true }))
    async postEditProduct(@Body() body: { prodId: string }, @Body() createProductDto: CreateProductDto)
       {
        try {
            const { prodId } = body;            
            await this.productService.updateProduct(prodId, createProductDto.title, createProductDto.price, createProductDto.description);
            return { message: ` (ID: ${prodId})'li Ürün başarıyla güncellendi.` };
        } 
        catch (error) {
            return {
              message: 'Ürün güncellenirken bir hata oluştu.',
              error: error
            };
          }
        }
        
        @ApiBody({
          description: 'Paramatre olaran verilen IDye sahip bir ürün varsa ürünün isDeleted özelliğini 1 yapar.',
          type: Object,
          schema: {
            properties: {
              productId: { type: 'string', example: '60d21b4667d0d8992e610c85' }
            }
          }
        })
        @ApiResponse({
          status: 200,
          description: 'Success.',
          schema: {
            example: {
              message: 'x ID li Ürün başarıyla silindi..'
            }
          }
        })
        @ApiResponse({
          status: 500,
          description: 'Internal server error',
          schema: {
            example: {
              message: 'Ürünü silme işlemi sırasında bir hata oluştu.',
              error: 'Detaylı hata mesajı.'
            }
          }
        })
        @Post('/delete')
        @UsePipes(new ValidationPipe({ whitelist: true }))
        async deleteProduct(@Body() body: { prodId: string })
       {
        try {
            const { prodId } = body;
            console.log(prodId);
          await this.productService.deleteProduct(prodId);
          return { message: ` (ID: ${prodId})'li Ürün başarıyla silindi.` };
        } 
        catch (error) {
            return {
              message: 'Ürünü silme işlemi sırasında bir hata oluştu.',
              error: error
            };
          }
        }
}
  
  