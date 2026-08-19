import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

@Injectable()
export class NotesService {
  constructor(private readonly prisma: PrismaService) {}

  private async ensureApplicationOwnership(
    userId: string,
    applicationId: string,
  ) {
    const application = await this.prisma.jobApplication.findFirst({
      where: {
        id: applicationId,
        userId,
      },
    });

    if (!application) {
      throw new NotFoundException('Job application not found');
    }

    return application;
  }

  async create(
    userId: string,
    applicationId: string,
    dto: CreateNoteDto,
  ) {
    await this.ensureApplicationOwnership(userId, applicationId);

    return this.prisma.applicationNote.create({
      data: {
        content: dto.content,
        applicationId,
      },
    });
  }

  async findAll(
    userId: string,
    applicationId: string,
  ) {
    await this.ensureApplicationOwnership(userId, applicationId);

    return this.prisma.applicationNote.findMany({
      where: {
        applicationId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async update(
    userId: string,
    applicationId: string,
    noteId: string,
    dto: UpdateNoteDto,
  ) {
    await this.ensureApplicationOwnership(userId, applicationId);

    const note = await this.prisma.applicationNote.findFirst({
      where: {
        id: noteId,
        applicationId,
      },
    });

    if (!note) {
      throw new NotFoundException('Note not found');
    }

    return this.prisma.applicationNote.update({
      where: {
        id: noteId,
      },
      data: dto,
    });
  }

  async remove(
    userId: string,
    applicationId: string,
    noteId: string,
  ) {
    await this.ensureApplicationOwnership(userId, applicationId);

    const note = await this.prisma.applicationNote.findFirst({
      where: {
        id: noteId,
        applicationId,
      },
    });

    if (!note) {
      throw new NotFoundException('Note not found');
    }

    return this.prisma.applicationNote.delete({
      where: {
        id: noteId,
      },
    });
  }
}