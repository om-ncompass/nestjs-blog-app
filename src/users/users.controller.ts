import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';

import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { CustomApiResponse } from 'src/utils/send-response';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';


@Controller('user')
export class UsersController {
  constructor(
    private readonly usersService: UsersService
  ) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    
    const createdUser = await this.usersService.create(createUserDto);
    return new CustomApiResponse(200, 'User created succesfully', createdUser);
  }

  // @Get(':id')
  // async findOne(@Param('id') id: string) {
  //   const user = await this.usersService.findUserById(id);
  //   return new CustomApiResponse(200, 'User fetched succesfully', user);
  // }

  @UseGuards(JwtAuthGuard)
  @Get('details')
  async getDetails(@Req() req: Request) {
    const username = req.user['username'];
    
    const data = await this.usersService.userDetails(username);
    return new CustomApiResponse(200, 'User Details Fetched', data);
  }
}
