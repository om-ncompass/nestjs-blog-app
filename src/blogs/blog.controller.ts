import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { CustomApiResponse } from 'src/utils/send-response';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(@Body() createBlogDto: CreateBlogDto, @Req() req: Request) {
    const createdBlog = await this.blogService.create(createBlogDto, req);
    return new CustomApiResponse(200, 'Blog created succesfully', createdBlog);
  }
}