import { IsString, IsDateString, IsOptional, IsInt, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsDateString()
  dueTo: Date;

  @IsString()
  relevance: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  priority?: number;

  @Type(() => Number)
  @IsInt()
  userId: number;
}