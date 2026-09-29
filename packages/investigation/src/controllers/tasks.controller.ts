import { Controller, Get, Post, Body } from '@nestjs/common';

@Controller('investigations/tasks')
export class TasksController {
  @Get()
  async listTasks() {
    return { tasks: [] };
  }

  @Post()
  async createTask(@Body() body: any) {
    return { taskId: 'task-1' };
  }
}
