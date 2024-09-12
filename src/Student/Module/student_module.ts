import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StudentController } from '../Controller/student_controller'; 
import { StudentService } from '../student_service'; 
import { StudentSchema, Student } from 'src/Schemas/student_schema'; 
import { AuthModule } from 'src/Auth/Module/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Student.name, schema: StudentSchema }]),
    AuthModule
  ],
  controllers: [StudentController],
  providers: [StudentService],
  exports: [StudentService],
 
})
export class StudentsModule {}