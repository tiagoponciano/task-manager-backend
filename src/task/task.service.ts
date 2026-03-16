import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-tarefa.dto';

@Injectable()
export class TaskService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateTaskDto) {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: dto.userId },
    });
    return this.prisma.tarefa.create({
      data: {
        title: dto.title,
        description: dto.description ?? null,
        dueTo: new Date(dto.dueTo),
        relevance: dto.relevance,
        priority: dto.priority ?? 0,
        userId: dto.userId,
        tenantId: user.tenantId ?? undefined,
      },
    });
  }
  async findAll(tenantId?: number) {
    return this.prisma.tarefa.findMany({
      where: tenantId ? { tenantId } : undefined,
      orderBy: { createdOn: 'desc' },
    });
  }

  async findOne(id: number) {
    return this.prisma.tarefa.findUniqueOrThrow({
        where: { id }
    });
  }

  async update(id: number, dto: UpdateTaskDto) {
    return this.prisma.tarefa.update({
        where: { id },
        data: {
            ...(dto.title && { title: dto.title }),
            ...(dto.description && { description: dto.description }),
            ...(dto.dueTo && { dueTo: new Date(dto.dueTo) }),
            ...(dto.relevance && { relevance: dto.relevance }),
            ...(dto.priority !== undefined && { priority: dto.priority }),
            ...(dto.concluded !== undefined && { concluded: dto.concluded }),
        },
    });
  }

  async remove(id: number) {
    return this.prisma.tarefa.delete({
        where: { id }
    });
  }
}