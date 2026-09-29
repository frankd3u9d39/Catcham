import { Controller, Post, Body } from '@nestjs/common';

@Controller('investigations/notes')
export class NotesController {
  @Post()
  async addNote(@Body() body: any) {
    return { noteId: 'note-1' };
  }
}
