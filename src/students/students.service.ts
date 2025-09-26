import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { GroupsService } from '../groups/groups.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateStudentStatusDto } from './dto/update-status.dto';
import { Role, Status } from '@prisma/client';

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
        status: createStudentDto.status || Status.STUDYING,
        role: createStudentDto.role || Role.USER,
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

  async findAll(role: Role, studentId?: number, status?: Status) {
    const whereCondition: any = {};

    // если есть фильтр по статусу
    if (status) {
      whereCondition.status = status;
    }

    if (role === Role.ADMIN) {
      // 🔹 Админ видит всех студентов (с фильтром по статусу, если указан)
      return this.prismaService.student.findMany({
        where: whereCondition,
        include: { group: true },
      });
    }

    if (!studentId) {
      throw new NotFoundException('Student ID is required for non-admin users');
    }

    // 🔹 Обычный пользователь видит только себя (с фильтром по статусу, если он указан)
    return this.prismaService.student.findMany({
      where: {
        ...whereCondition,
        studentId,
      },
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
    } catch {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }
  }

  async remove(id: number) {
    try {
      return await this.prismaService.student.delete({
        where: { id },
      });
    } catch {
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
