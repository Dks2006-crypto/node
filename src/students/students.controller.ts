import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { UpdateStudentStatusDto } from './dto/update-status.dto';
import { UnauthorizedException } from '@nestjs/common';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('students')
@UseGuards(JwtAuthGuard, RolesGuard) // Защищаем все маршруты JWT + Role Guard
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  // Создание студента (только ADMIN)
  @Post()
  @Roles(Role.ADMIN)
  create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentsService.create(createStudentDto);
  }

  // Получение всех студентов
  @Get()
  findAll(@Req() req) {
    const { role, studentId } = req.user;
    return this.studentsService.findAll(role, studentId);
  }

  // Получение одного студента по ID
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Req() req) {
    // ADMIN видит любого, USER — только себя
    return this.studentsService.findOne(id);
  }

  // Обновление данных студента (только ADMIN)
  @Patch(':id')
  @Roles(Role.ADMIN)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStudentDto: UpdateStudentDto
  ) {
    return this.studentsService.update(id, updateStudentDto);
  }

  // Изменение статуса студента (только ADMIN)
  @Patch(':id/status')
  @Roles(Role.ADMIN)
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateStudentStatusDto
  ) {
    return this.studentsService.updateStudentStatus(id, dto);
  }

  // Удаление студента (только ADMIN)
  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.studentsService.removeStudent(id);
  }
}
