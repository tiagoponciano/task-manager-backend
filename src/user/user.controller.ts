import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    ParseIntPipe,
  } from '@nestjs/common';
  import { UserService } from './user.service';
  import { CreateUserDto } from './dto/create-user.dto';
  import { UpdateUserDto } from './dto/update-user.dto';
  import { LoginDto } from './dto/login.dto';
  import { ChangePasswordDto } from './dto/change-password.dto';
  
  @Controller('user')
  export class UserController {
    constructor(private readonly userService: UserService) {}
  
    @Post()
    create(@Body() createUserDto: CreateUserDto) {
      return this.userService.create(createUserDto);
    }
  
    @Get()
    findAll() {
      return this.userService.findAll();
    }
  
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
      return this.userService.findOne(id);
    }
  
    @Patch(':id')
    update(
      @Param('id', ParseIntPipe) id: number,
      @Body() updateUserDto: UpdateUserDto,
    ) {
      return this.userService.update(id, updateUserDto);
    }
  
    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
      return this.userService.remove(id);
    }
  
    @Post('login')
    login(@Body() loginDto: LoginDto) {
      return this.userService.login(loginDto);
    }
  
    @Patch(':id/password')
    changePassword(
      @Param('id', ParseIntPipe) id: number,
      @Body() changePasswordDto: ChangePasswordDto,
    ) {
      return this.userService.changePassword(id, changePasswordDto);
    }
  }