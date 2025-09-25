import { Module } from '@nestjs/common';
import { StudentsService } from './students.service';
import { StudentsController } from './students.controller';
import { PrismaService } from '../prisma/prisma.service';
import { GroupsModule } from '../groups/groups.module';

@Module({
  imports: [GroupsModule],
  controllers: [StudentsController],
  providers: [StudentsService, PrismaService],
})
export class StudentsModule {}
