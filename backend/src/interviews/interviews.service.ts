import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateInterviewDto } from './dto/create-interview.dto';
import { UpdateInterviewDto } from './dto/update-interview.dto';

@Injectable()
export class InterviewsService {
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
    dto: CreateInterviewDto,
  ) {
    await this.ensureApplicationOwnership(userId, applicationId);

    return this.prisma.interview.create({
      data: {
        title: dto.title,
        scheduledAt: new Date(dto.scheduledAt),
        location: dto.location,
        meetingUrl: dto.meetingUrl,
        notes: dto.notes,
        applicationId,
      },
    });
  }

  async findAll(userId: string, applicationId: string) {
    await this.ensureApplicationOwnership(userId, applicationId);

    return this.prisma.interview.findMany({
      where: {
        applicationId,
      },
      orderBy: {
        scheduledAt: 'asc',
      },
    });
  }

  async update(
    userId: string,
    applicationId: string,
    interviewId: string,
    dto: UpdateInterviewDto,
  ) {
    await this.ensureApplicationOwnership(userId, applicationId);

    const interview = await this.prisma.interview.findFirst({
      where: {
        id: interviewId,
        applicationId,
      },
    });

    if (!interview) {
      throw new NotFoundException('Interview not found');
    }

    return this.prisma.interview.update({
      where: {
        id: interviewId,
      },
      data: {
        ...dto,
        ...(dto.scheduledAt
          ? { scheduledAt: new Date(dto.scheduledAt) }
          : {}),
      },
    });
  }

  async remove(
    userId: string,
    applicationId: string,
    interviewId: string,
  ) {
    await this.ensureApplicationOwnership(userId, applicationId);

    const interview = await this.prisma.interview.findFirst({
      where: {
        id: interviewId,
        applicationId,
      },
    });

    if (!interview) {
      throw new NotFoundException('Interview not found');
    }

    return this.prisma.interview.delete({
      where: {
        id: interviewId,
      },
    });
  }
}