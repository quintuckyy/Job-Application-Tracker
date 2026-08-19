import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { NotesService } from './notes.service';

type JwtUser = {
  sub: string;
};

@Controller('applications/:applicationId/notes')
@UseGuards(JwtAuthGuard)
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  create(
    @CurrentUser() user: JwtUser,
    @Param('applicationId') applicationId: string,
    @Body() dto: CreateNoteDto,
  ) {
    return this.notesService.create(
      user.sub,
      applicationId,
      dto,
    );
  }

  @Get()
  findAll(
    @CurrentUser() user: JwtUser,
    @Param('applicationId') applicationId: string,
  ) {
    return this.notesService.findAll(
      user.sub,
      applicationId,
    );
  }

  @Patch(':noteId')
  update(
    @CurrentUser() user: JwtUser,
    @Param('applicationId') applicationId: string,
    @Param('noteId') noteId: string,
    @Body() dto: UpdateNoteDto,
  ) {
    return this.notesService.update(
      user.sub,
      applicationId,
      noteId,
      dto,
    );
  }

  @Delete(':noteId')
  remove(
    @CurrentUser() user: JwtUser,
    @Param('applicationId') applicationId: string,
    @Param('noteId') noteId: string,
  ) {
    return this.notesService.remove(
      user.sub,
      applicationId,
      noteId,
    );
  }
}