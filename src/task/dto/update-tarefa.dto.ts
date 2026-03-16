import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskDto } from './create-task.dto';
import { IsInt, IsOptional, IsDateString, IsBoolean } from 'class-validator';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
    @IsOptional()
    @IsBoolean()
    concluded?: boolean;

    @IsOptional()
    @IsInt()
    priority?: number;

    @IsOptional()
    @IsDateString()
    dueTo?: Date;
}