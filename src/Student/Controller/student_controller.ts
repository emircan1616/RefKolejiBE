import { Controller, Post, UseGuards, UsePipes, ValidationPipe, Body } from '@nestjs/common';
import { CreateStudentDto } from '../Dto/student_dto'; 
import { StudentService } from '../student_service'; 
import { JwtAuthGuard } from 'src/Auth/Jwt/jwt-auth.guard';
import { ApiTags, ApiBody, ApiResponse } from '@nestjs/swagger';


@ApiTags('Students')
@Controller('students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

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
  @ApiResponse({
    status: 500,
    description: 'Öğrenci eklerken bir hata oluştu.',
    schema: {
      example: {
        message: 'Öğrenci eklerken bir hata oluştu.',
        error: 'Detaylı hata mesajı.',
      },
    },
  })
  @Post('add')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async addStudent(@Body() createStudentDto: CreateStudentDto) {
    try {
      await this.studentService.addStudent(createStudentDto);
      return {
        message: 'Başarılı',
      };
    } catch (error) {
      return {
        message: 'Öğrenci eklerken bir hata oluştu.',
        error: error.message,
      };
    }
  }

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
  @ApiResponse({
    status: 500,
    description: 'Öğrenciler eklerken bir hata oluştu.',
    schema: {
      example: {
        message: 'Öğrenciler eklerken bir hata oluştu.',
        error: 'Detaylı hata mesajı.',
      },
    },
  })
  @Post('add-multiple')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async addMultipleStudents(@Body() createStudentDtos: CreateStudentDto[]) {
    try {
      await this.studentService.addMultipleStudents(createStudentDtos);
      return {
        message: 'Başarılı',
      };
    } catch (error) {
      return {
        message: 'Öğrenciler eklerken bir hata oluştu.',
        error: error.message,
      };
    }
  }
}