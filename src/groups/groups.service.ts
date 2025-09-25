import { Injectable } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GroupsService {

  constructor(private readonly prismaService: PrismaService) {}

  async create(createGroupDto: CreateGroupDto) {
    return this.prismaService.group.create( {
      data: {
        name: createGroupDto.name,
        faculty: createGroupDto.faculty,
      },
      include: {
        students: true,
      },
    });
  }

  findAll() {
    return this.prismaService.group.findMany({
      include: {
        students: {
          select: {
            id: true,
            fullName: true,
            email: true,
            status: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} group`;
  }

  update(id: number, updateGroupDto: UpdateGroupDto) {
    return `This action updates a #${id} group`;
  }

  remove(id: number) {
    return `This action removes a #${id} group`;
  }
}
