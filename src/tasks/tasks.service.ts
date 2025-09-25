// import { Injectable, NotFoundException } from '@nestjs/common';
// import { PrismaService } from '../prisma/prisma.service';
// import { CreateTaskDTO } from './dto/create-task.dto';
// import { UpdateTaskDto } from './dto/update-task.dto';
//
// @Injectable()
// export class TasksService {
//   constructor(private readonly prismaService: PrismaService) {
//
//   }
//   async findAll(userId: number, role: string){
//     if(role === "ADMIN") return this.prismaService.task.findMany()
//    return this.prismaService.task.findMany({
//      where: { userId },
//      include: {user: true },
//    })
//   }
//   async findOne( id: number){
//     const task = await this.prismaService.task.findUnique({
//       where: { id },
//       include: { user: {
//         select: {
//           name: true,
//           email: true},
//         },
//       },
//     });
//     if (!task) throw new NotFoundException(`Запись с id ${id} не найдено`)
//     return task;
//   }
//
//   async create(userId: number, dto: CreateTaskDTO){
//     return this.prismaService.task.create({
//       data:{...dto, userId },
//     })
//   }
//
//   async update(id: number, dto: UpdateTaskDto){
//     const task = await this.prismaService.task.findUnique({
//       where: { id } });
//     if (!task) throw new NotFoundException(`Запись с id ${id} не найдено`);
//     return this.prismaService.task.update({ where: {id}, data:{...dto}});
//   }
//
//   async delete(id: number){
//     const task = await this.prismaService.task.findUnique({
//       where: { id } });
//     if (!task) throw new NotFoundException(`Запись с id ${id} не найдено`);
//     return this.prismaService.task.delete({ where: { id } });
//   }
// }
