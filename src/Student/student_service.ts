import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateStudentDto } from './Dto/student_dto';
import { Student, StudentDocument } from '../Schemas/student_schema'; 
import { CustomApiError } from 'src/core/utils/custom_api_error';
import { errorTypes } from 'src/core/data/error_types';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';
import e from 'express';
import { error } from 'console';


@Injectable()
export class StudentService {
  constructor(@InjectModel(Student.name) private studentModel: Model<StudentDocument>) {}

  async addStudent(createStudentDto: CreateStudentDto): Promise<Student> {
    try {
      createStudentDto.studentPassword = Math.floor(100000 + Math.random() * 900000).toString();//Öğrenci için 6 basamaklı random sisteme giriş şifresi verildi kullanıcı adı TC
      createStudentDto.parentPassword = Math.floor(100000 + Math.random() * 900000).toString();//Veli için 6 basamaklı random sisteme giriş şifresi verildi kullanıcı adı TC

      const existingStudent = await this.studentModel.findOne({ tcNo: createStudentDto.tcNo });

      if (existingStudent) {
        throw new CustomApiError('Bu TC numarasına sahip bir öğrenci zaten mevcut.', errorTypes.duplicateValue);
      }


      const createdStudent = new this.studentModel(createStudentDto);
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
      const transformedDtos = newStudents.map(dto => ({
        ...dto,
        birthDate: new Date(dto.birthDate),
        section: dto.section || 'default-section'
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

}