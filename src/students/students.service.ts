import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { PrismaService } from '../prisma/prisma.service';
import { GroupsService} from '../groups/groups.service';

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

  findAll(studentId: number, role: string) {
    if (role === "ADMIN") {
      return this.prismaService.student.findMany({
        include: { group: true },
      });
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
    return lastStudent ? lastStudent.studentId + 1 : 1000;
  }
}