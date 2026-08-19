import {
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Min,
} from 'class-validator';

export class UpdateApplicationDto {
  @IsOptional()
  @IsString()
  company?: string;

  @IsOptional()
  @IsString()
  position?: string;

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