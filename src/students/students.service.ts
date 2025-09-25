import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { GroupsService} from '../groups/groups.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateStudentStatusDto } from './dto/update-status.dto';
import { Role } from '@prisma/client';

@Injectable()
export class StudentsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly groupsService: GroupsService,
  ) {}

  async create(createStudentDto: CreateStudentDto) {
    const nextStudentId = await this.getNextStudentId();

    return this.prismaService.student.create({
      data: {
        fullName: createStudentDto.fullName,
        email: createStudentDto.email,
        groupId: createStudentDto.groupId,
        studentId: nextStudentId,
        status: createStudentDto.status || 'STUDYING',
        role: createStudentDto.role || 'USER',
      },
      include: { group: true },
    });
  }
  async updateStudentStatus(id: number, dto: UpdateStudentStatusDto) {
    const student = await this.prismaService.student.findUnique({ where: { id } });
    if (!student) throw new NotFoundException(`Student with ID ${id} not found`);

    return this.prismaService.student.update({
      where: { id },
      data: { status: dto.status, updatedAt: new Date() },
    });
  }

  async removeStudent(id: number) {
    const student = await this.prismaService.student.findUnique({ where: { id } });
    if (!student) throw new NotFoundException(`Student with ID ${id} not found`);

    return this.prismaService.student.delete({ where: { id } });
  }


  findAll(role: Role, studentId?: number) {
    if (role === Role.ADMIN || role === Role.USER) {
      // Для админа возвращаем всех студентов
      return this.prismaService.student.findMany({
        include: { group: true },
      });
    }

    // Для обычного пользователя возвращаем только его запись
    if (!studentId) {
      throw new NotFoundException('Student ID is required for non-admin users');
    }

    return this.prismaService.student.findMany({
      where: { studentId },
      include: { group: true },
    });
  }


  async findOne(id: number) {
    const student = await this.prismaService.student.findUnique({
      where: { id },
      include: { group: true },
    });

    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }

    return student;
  }

  async update(id: number, updateStudentDto: UpdateStudentDto) {
    try {
      return await this.prismaService.student.update({
        where: { id },
        data: updateStudentDto,
        include: { group: true },
      });
    } catch (error) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }
  }

  async remove(id: number) {
    try {
      return await this.prismaService.student.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }
  }

  private async getNextStudentId(): Promise<number> {
    const lastStudent = await this.prismaService.student.findFirst({
      orderBy: { studentId: 'desc' },
    });
    return lastStudent ? lastStudent.studentId + 1 : 1;
  }
}