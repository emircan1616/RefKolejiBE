import { Controller, Post, UseGuards, UsePipes, ValidationPipe, Body, applyDecorators, Get, Delete, Param } from '@nestjs/common';
import { CreateStudentDto } from '../Dto/student_dto';
import { StudentService } from '../student_service';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { ApiTags, ApiBody, ApiResponse, ApiOperation, ApiBearerAuth, ApiHeader } from '@nestjs/swagger';
import { commonErrorResponses } from 'src/core/helper/exception_helper';

@ApiTags('Students')
@Controller('students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @ApiOperation({ summary: 'Add a new student' })
  @ApiHeader({
    name: 'Authorization',
    description: 'JWT token',
    required: true,
  })
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
  @Post('add-student')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async addStudent(@Body() createStudentDto: CreateStudentDto) {
    const student = await this.studentService.addStudent(createStudentDto);
    return {
      message: 'Başarılı',
      student: student,
    };
  }

  @ApiOperation({ summary: 'Add multiple new students' })
  @ApiHeader({
    name: 'Authorization',
    description: 'JWT token',
    required: true,
  })
  @ApiBody({
    description: 'Birden fazla öğrenci eklemek için gerekli veriler',
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
  @applyDecorators(...commonErrorResponses())
  @Post('add-multiple-student')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async addMultipleStudents(@Body() createStudentDtos: CreateStudentDto[]) {
    const students = await this.studentService.addMultipleStudents(createStudentDtos);
    return {
      message: 'Başarılı',
      students: students,
    };
  }
  @ApiOperation({ summary: 'Get all students' })
  @ApiHeader({
    name: 'Authorization',
    description: 'JWT token',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'kayıtlı tüm öğrenciler getirildi',
    schema: {
      example: [
        {
          _id: '60d0fe4f5311236168a109ca',
          firstName: 'Ali',
          lastName: 'Veli',
          tcNo: '12345678901',
          birthDate: '2005-05-15T00:00:00.000Z',
          class: '10',
          section: 'A',
          mentor: 'Ahmet Hoca'
        }
      ],
    },
  })
  @applyDecorators(...commonErrorResponses())
  @Get('get-all-students')
  @UseGuards(JwtAuthGuard)
  async getAllStudents() {
    const students = await this.studentService.getAllStudents();
    return students;
  }

  @ApiOperation({ summary: 'Delete student by tcNo' })
  @ApiHeader({
    name: 'Authorization',
    description: 'JWT token',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Öğrenci başarıyla silindi.',
    schema: {
      example: {
        message: 'Başarılı',
      },
    },
  })
  @applyDecorators(...commonErrorResponses())
  @Delete('delete-student-by-tcNo')
  @UseGuards(JwtAuthGuard)
  async deleteStudentByTcNo(@Param('tcNo') tcNo: String) {
    await this.studentService.deleteStudentByTcNo(tcNo);
    return {
      message: 'Başarılı',
    };
  }

  @ApiOperation({ summary: 'Get students by class' })
  @ApiHeader({
    name: 'Authorization',
    description: 'JWT token',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Belirtilen siniftaki öğrenciler getirildi',
    schema: {
      example:[
        {
          _id: '60d0fe4f5311236168a109ca',
          firstName: 'Ali',
          lastName: 'Veli',
          tcNo: '12345678901',
          birthDate: '2005-05-15T00:00:00.000Z',
          class: '10',
          section: 'A',
          mentor: 'Ahmet Hoca'
        }
      ]
    }
  })

  @applyDecorators(...commonErrorResponses())
  @Get('get-students-by-class')
  @UseGuards(JwtAuthGuard)
  async getStudentsByClass(@Param('className') className: string) {
    const students = await this.studentService.getStudentByClass(className);
    return students;
  }

}