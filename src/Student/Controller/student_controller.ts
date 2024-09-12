import { Controller, Post, UseGuards, UsePipes, ValidationPipe, Body, applyDecorators } from '@nestjs/common';
import { CreateStudentDto } from '../Dto/student_dto';
import { StudentService } from '../student_service';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { ApiTags, ApiBody, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { commonErrorResponses } from 'src/core/helper/exception_helper';

@ApiTags('Students')
@Controller('students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @ApiOperation({ summary: 'Add a new student' })
  @ApiBody({
    description: 'Yeni bir öğrenci eklemek için gerekli veriler',
    type: CreateStudentDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Öğrenci başarıyla eklendi.',
    schema: {
      example: {
        message: 'Başarılı',
      },
    },
  })
  @applyDecorators(...commonErrorResponses())
  @Post('add')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async addStudent(@Body() createStudentDto: CreateStudentDto) {
    const student = await this.studentService.addStudent(createStudentDto);
    return {
      message: 'Başarılı',
      student: student,
    };
  }

@Post('add-multiple')
@UseGuards(JwtAuthGuard)
@UsePipes(new ValidationPipe({ whitelist: true }))
@ApiOperation({ summary: 'Add multiple students' })
@ApiBody({
  description: 'Yeni öğrenciler eklemek için gerekli veriler',
  type: [CreateStudentDto],
})
@ApiResponse({
  status: 201,
  description: 'Öğrenciler başarıyla eklendi.',
  schema: {
    example: {
      message: 'Başarılı',
    },
  },
})
@ApiResponse({ status: 400, description: 'Invalid input' }) // Örnek bir commonErrorResponse
async addMultipleStudents(@Body() createStudentDtos: CreateStudentDto[]) {
  const students = await this.studentService.addMultipleStudents(createStudentDtos);
  return {
    message: 'Başarılı',
    students: students,
  };
}

}