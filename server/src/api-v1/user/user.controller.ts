import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ValidationPipe, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../../modules/immich-jwt/guards/jwt-auth.guard';
import { AuthUserDto, GetAuthUser } from '../../decorators/auth-user.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { AdminRolesGuard } from '../../middlewares/admin-role-guard.middleware';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllUsers(@GetAuthUser() authUser: AuthUserDto) {
    return await this.userService.getAllUsers(authUser);
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(AdminRolesGuard)
  @Post()
  async createNewUser(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    return await this.userService.createUser(createUserDto);
  }

  @Get('/count')
  async getUserCount() {
    return await this.userService.getUserCount();
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  async updateUser(@GetAuthUser() authUser: AuthUserDto, @Body(ValidationPipe) updateUserDto: UpdateUserDto) {
    return await this.userService.updateUser(authUser, updateUserDto)
  }
}
