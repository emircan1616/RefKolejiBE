import { Injectable, BadRequestException, InternalServerErrorException, NotFoundException  } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Product } from 'src/Schemas/product.schema';
import { CreateProductDto } from './dto/add-product';
import { format } from 'date-fns';

@Injectable()
export class ProductService {
  constructor(@InjectModel('Product') private readonly productModel: Model<Product>) {}

  async findByName(title: string): Promise<Product | null> {
    try{
        return this.productModel.findOne({ title }).exec();
    }
    catch{
        throw new InternalServerErrorException('Ürün kontrolü sırasında hata oluştu.');
    }
  }

  async addProduct(createProductDto: CreateProductDto) {
    try {
    const existingProduct = await this.findByName(createProductDto.title);
    if (existingProduct) {
        console.log('Bu Ürün zaten daha önceden eklenmiş')
      throw new BadRequestException('Bu isimli ürün zaten sistemde bulunmaktadır.');
    }

    const now = new Date();
    const formattedDate = format(now, 'dd/MM/yyyy hh.mm a');

    const product = new this.productModel({
      title: createProductDto.title,
      price: createProductDto.price,
      description: createProductDto.description,
      isActive: 1,
      isDeleted: 0,
      createDate: formattedDate 
    });

      const result = await product.save();
      return result;
    } 
    catch (error) {
      throw new InternalServerErrorException('Ürün ekleme işlemi sırasında bir hata oluştu.');
    }
  }

  async getProducts(): Promise<Product[]> {
    try {
      const products = await this.productModel.find({
        isActive: 1,
        isDeleted: 0
        }).exec();
      return products;
    }
     catch (err) {
      throw new NotFoundException('Ürünleri listeleme işlemi sırasında bir hata oluştu.', err);
    }
  }

  async updateProduct(prodId: string,title: string,price: number,description: string,): Promise<Product> {
    try {

        if (!Types.ObjectId.isValid(prodId)) {
            throw new BadRequestException('Geçersiz ürün ID\'si');
          }

      const objectId = new Types.ObjectId(prodId);
      const product = await this.productModel.findById(objectId).exec();

      if (!product) {
        throw new NotFoundException('Ürün bulunamadı');
      }

      product.title = title;
      product.price = price;
      product.description = description;

      await product.save();
      return product;
    }
    catch (err) {
        throw new NotFoundException('Ürün güncelleme işlemi sırasında bir hata oluştu.', err);
    }
  }

  async deleteProduct(prodId: string): Promise<Product> {
    try {
      console.log(prodId);
        if (!Types.ObjectId.isValid(prodId)) {
            throw new BadRequestException('Geçersiz ürün ID\'si');
          }
      const objectId = new Types.ObjectId(prodId);
      const product = await this.productModel.findById(objectId).exec();

      if (!product) {
        throw new NotFoundException('Ürün bulunamadı');
      }

      product.isDeleted = true;

      await product.save();
      return product;
    }
    catch (err) {
        throw new NotFoundException('Ürünü silme işlemi sırasında bir hata oluştu.', err);
    }
  }
}
