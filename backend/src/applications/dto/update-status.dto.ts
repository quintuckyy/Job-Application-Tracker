import { IsEnum } from 'class-validator';
import { ApplicationStatus } from '../../generated/prisma/enums';

export class UpdateStatusDto {
  @IsEnum(ApplicationStatus)
  status!: ApplicationStatus;
}