import { Injectable, ConflictException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateUserDto) {
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { user: dto.user },
          { email: dto.email },
        ],
      },
    });
    if (existingUser) {
      throw new ConflictException('Username or email already exists');
    }
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        user: dto.user,
        email: dto.email,
        password: hashedPassword,
        role: 'user',
        tenantId: dto.tenantId ?? null,
      },
    });
    const { password: _, ...result } = user;
    return result;
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: { id: true, user: true, email: true, role: true, tenantId: true },
    });
  }

  async findOne(id: number) {
    return this.prisma.user.findUniqueOrThrow({
      where: { id },
      select: { id: true, user: true, email: true, role: true, tenantId: true },
    });
  }

  async update(id: number, dto: UpdateUserDto) {
    const data: { user?: string } = {};
    if (dto.user) data.user = dto.user;
    const updated = await this.prisma.user.update({
      where: { id },
      data,
    });
    const { password: _, ...result } = updated;
    return result;
  }

  async remove(id: number) {
    const deleted = await this.prisma.user.delete({
      where: { id },
    });
    const { password: _, ...result } = deleted;
    return result;
  }

  async login(dto: { identifier: string; password: string }) {
    const isEmail = dto.identifier.includes('@');
    const user = await this.prisma.user.findFirst({
      where: isEmail
        ? { email: dto.identifier }
        : { user: dto.identifier },
    });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const { password: _, ...result } = user;
    return result; 
  }

  async changePassword(id: number, dto: ChangePasswordDto) {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id },
    });
    const valid = await bcrypt.compare(dto.currentPassword, user.password);
    if (!valid) {
      throw new UnauthorizedException('Current password is incorrect');
    }
    if (dto.newPassword === dto.currentPassword) {
      throw new BadRequestException('New password must be different');
    }
    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);
    const updated = await this.prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });
    const { password: _, ...result } = updated;
    return result;
  }
}