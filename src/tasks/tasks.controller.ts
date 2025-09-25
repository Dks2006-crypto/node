// import {
//   Controller,
//   Get,
//   Req,
//   Param,
//   UseGuards,
//   Post,
//   Body, Put, Delete,
// } from '@nestjs/common';
// import { TasksService } from './tasks.service';
// // import type { Request } from 'express';
// import { AuthGuard } from '@nestjs/passport';
// import { CreateTaskDTO } from './dto/create-task.dto';
// import { UpdateTaskDto } from './dto/update-task.dto';
// @Controller('tasks')
// @UseGuards(AuthGuard("jwt"))
// export class TasksController {
//   constructor(private readonly tasksService: TasksService) {}
//   @Get()
//   async findAll(@Req() req ) {
//     return this.tasksService.findAll(req.user.userId, req.user.role);
//
//   }
//
//   @Get(':id')
//   async findOne(@Param('id') id: string) {
//     return this.tasksService.findOne(parseInt(id));
//   }
//
//   @Post()
//   async create(@Req() req,@Body() dto: CreateTaskDTO) {
//     return this.tasksService.create(req.user.userId, dto);
//   }
//
//   @Put(':id')
//   async update(@Param('id') id: string, @Body() dto: UpdateTaskDto) {
//     return this.tasksService.update(parseInt(id), dto);
//   }
//
//   @Delete(':id')
//   async delete(@Param('id') id: string){
//     return this.tasksService.delete(parseInt(id));
//   }
// }
