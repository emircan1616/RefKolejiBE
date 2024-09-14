import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateStudentDto } from './Dto/student_dto';
import { Student, StudentDocument } from '../Schemas/student_schema'; 
import { CustomApiError } from 'src/core/utils/custom_api_error';
import { errorTypes } from 'src/core/data/error_types';


@Injectable()
export class StudentService {
  constructor(@InjectModel(Student.name) private studentModel: Model<StudentDocument>) {}

  async addStudent(createStudentDto: CreateStudentDto): Promise<Student> {
    try {
      const createdStudent = new this.studentModel(createStudentDto);
      return await createdStudent.save();
    } catch (error) {
      throw new CustomApiError('Öğrenci eklerken bir hata oluştu.', errorTypes.invalidValue);
    }
  }

  async addMultipleStudents(createStudentDtos: CreateStudentDto[]): Promise<Student[]> {
    try {
      const transformedDtos = createStudentDtos.map(dto => ({
        ...dto,
        birthDate: new Date(dto.birthDate),
        section: dto.section || 'default-section' 
      }));
      const createdStudents = await this.studentModel.insertMany(transformedDtos);
      return createdStudents as Student[]; 
    } catch (error) {
      throw new CustomApiError('Öğrenciler eklerken bir hata oluştu.', errorTypes.invalidValue);
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