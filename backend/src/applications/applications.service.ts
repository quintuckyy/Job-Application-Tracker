import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { QueryApplicationsDto } from './dto/query-applications.dto';

@Injectable()
export class ApplicationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateApplicationDto) {
    return this.prisma.jobApplication.create({
      data: {
        company: dto.company,
        position: dto.position,
        status: dto.status,
        salaryMin: dto.salaryMin,
        salaryMax: dto.salaryMax,
        location: dto.location,
        jobUrl: dto.jobUrl,
        userId,
      },
    });
  }

  async findAll(userId: string, query: QueryApplicationsDto) {
    const {
        page,
        limit,
        search,
        status,
        sortBy,
        sortOrder,
    } = query;

    const skip = (page - 1) * limit;

    const where = {
        userId,
        ...(status ? { status } : {}),
        ...(search
        ? {
            OR: [
                {
                company: {
                    contains: search,
                    mode: 'insensitive' as const,
                },
                },
                {
                position: {
                    contains: search,
                    mode: 'insensitive' as const,
                },
                },
                {
                location: {
                    contains: search,
                    mode: 'insensitive' as const,
                },
                },
            ],
            }
        : {}),
    };

    const [applications, total] = await this.prisma.$transaction([
        this.prisma.jobApplication.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder,
        },
        }),
        this.prisma.jobApplication.count({
        where,
        }),
    ]);

    return {
        data: applications,
        meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        },
    };
  }

  async findOne(userId: string, id: string) {
    const application = await this.prisma.jobApplication.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!application) {
      throw new NotFoundException('Job application not found');
    }

    return application;
  }

  async update(
    userId: string,
    id: string,
    dto: UpdateApplicationDto,
  ) {
    await this.findOne(userId, id);

    return this.prisma.jobApplication.update({
      where: {
        id,
      },
      data: dto,
    });
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);

    return this.prisma.jobApplication.delete({
      where: {
        id,
      },
    });
  }
}