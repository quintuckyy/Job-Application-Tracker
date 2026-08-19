import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Min,
} from 'class-validator';
import { ApplicationStatus } from '../../generated/prisma/enums';

export class CreateApplicationDto {
  @IsString()
  company!: string;

  @IsString()
  position!: string;

  @IsOptional()
  @IsEnum(ApplicationStatus)
  status?: ApplicationStatus;

  @IsOptional()
  @IsInt()
  @Min(0)
  salaryMin?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  salaryMax?: number;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsUrl()
  jobUrl?: string;
}