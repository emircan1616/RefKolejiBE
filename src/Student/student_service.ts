import { Injectable, BadRequestException, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateStudentDto } from './Dto/student_dto';
import { Student, StudentDocument } from '../Schemas/student_schema'; 
import { CustomApiError } from 'src/core/utils/custom_api_error';
import { errorTypes } from 'src/core/data/error_types';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';
import e from 'express';
import { error } from 'console';
import { User } from 'src/Schemas/user.schema';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { createDecipheriv } from 'crypto';


@Injectable()
export class StudentService {
  constructor(@InjectModel(Student.name) private studentModel: Model<StudentDocument>, private readonly jwtService: JwtService) {}

  async addStudent(createStudentDto: CreateStudentDto): Promise<Student> {
    try {
      createStudentDto.studentPassword = Math.floor(100000 + Math.random() * 900000).toString();
      createStudentDto.parentPassword = Math.floor(100000 + Math.random() * 900000).toString();
      console.log(createStudentDto.studentPassword);

      const existingStudent = await this.studentModel.findOne({ tcNo: createStudentDto.tcNo });

      if (existingStudent) {
        throw new CustomApiError('Bu TC numarasına sahip bir öğrenci zaten mevcut.', errorTypes.duplicateValue);
      }

      const hashedPassword = await bcrypt.hash(createStudentDto.studentPassword, 12);
      const hashedParentPassword = await bcrypt.hash(createStudentDto.parentPassword, 12);

      createStudentDto.studentPassword = hashedPassword;
      createStudentDto.parentPassword = hashedParentPassword;

      const createdStudent = new this.studentModel(createStudentDto);

      console.log(createdStudent);
      return await createdStudent.save();
    } catch (error) {
      throw new CustomApiError(`Öğrenci eklerken bir hata oluştu: ${error}`, errorTypes.invalidValue);
    }
  }

  async addMultipleStudents(createStudentDtos: CreateStudentDto[]): Promise<Student[]> {
    try {
      const tcNumbersFromDtos = createStudentDtos.map(dto => dto.tcNo);
  
      const existingStudents = await this.studentModel.find({ tcNo: { $in: tcNumbersFromDtos } });
      const existingTcNumbers = new Set(existingStudents.map(student => student.tcNo));
  
      const newStudents = createStudentDtos.filter(dto => !existingTcNumbers.has(dto.tcNo));
  
      const transformedDtos = await Promise.all(newStudents.map(async (dto) => {
        dto.studentPassword = Math.floor(100000 + Math.random() * 900000).toString();
        dto.parentPassword = Math.floor(100000 + Math.random() * 900000).toString();
  
        const hashedStudentPassword = await bcrypt.hash(dto.studentPassword, 12);
        const hashedParentPassword = await bcrypt.hash(dto.parentPassword, 12);
  
        return {
          ...dto,
          studentPassword: hashedStudentPassword,
          parentPassword: hashedParentPassword,
          birthDate: new Date(dto.birthDate),
          section: dto.section || 'default-section'
        };
      }));
  
      const createdStudents = await this.studentModel.insertMany(transformedDtos);
      return createdStudents as Student[];
    } catch (error) {
      throw new CustomApiError(`Öğrenciler eklerken bir hata oluştu: ${error}`, errorTypes.invalidValue);
    }
  }
  
  async getAllStudents(): Promise<Student[]>{
    return this.studentModel.find().exec();
  }

  async deleteStudentByTcNo(tcNo: String): Promise<void>{
    const result = await this.studentModel.deleteOne({ tcNo }).exec();
    if(result.deletedCount === 0){
      throw new CustomApiError('Öğrenci bulunamadı.', errorTypes.dataNotFound);
  }
}

async getStudentByClass(className: string): Promise<Student[]>{
  return this.studentModel.find({ class: className }).exec();
}

async login(req: Request, tcNo: string, studentPasswordpassword: string): Promise<any> {
  try {
    console.log(tcNo, studentPasswordpassword);
    const user = await this.studentModel.findOne({ tcNo }).exec();
    console.log(user);
    if (!user) {
      throw new UnauthorizedException('Hatalı kullanıcı adı.');
    }
    const isMatch = await bcrypt.compare(studentPasswordpassword, user.studentPassword);
    if (!isMatch) {
      console.log(isMatch);
      throw new UnauthorizedException('Hatalı Şifre.');
    }

    const payload = { userId: user._id, tcNo: user.tcNo };
    const accessToken = this.jwtService.sign(payload);

    req.session.user = {
      userId: user._id.toString(),
      username: user.tcNo,
    };
      console.log('sesion started') 
    return {
      access_token: accessToken,
      user: {
        userId: user._id,
        kullaniciAdi: user.tcNo,        
      }
    };
  } catch (error) {
    throw new InternalServerErrorException('Giriş işlemi sırasında bir hata oluştu.', error);
  }
}
}