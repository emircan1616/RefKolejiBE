import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StudentController } from '../Controller/student_controller'; 
import { StudentService } from '../student_service'; 
import { StudentSchema, Student } from 'src/Schemas/student_schema'; 

@Module({
  imports: [MongooseModule.forFeature([{ name: Student.name, schema: StudentSchema }])],
  controllers: [StudentController],
  providers: [StudentService],
})
export class StudentsModule {}