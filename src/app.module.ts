import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { TaskModule } from './task/task.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    TaskModule,
    UserModule,
  ],
})
export class AppModule {}
