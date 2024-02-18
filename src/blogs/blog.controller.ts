import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { Request } from 'express';

import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CustomApiResponse } from 'src/utils/send-response';
import { UpdateBlogDto } from './dto/update-blog.dto';

@Controller('blog')
export class BlogController {
  
  constructor(
    private readonly blogService: BlogService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getLoggedInUserBlogs(@Req() req: Request) {

    const fetchedBlogs = await this.blogService.getLoggedInUserBlogs(req);
    return new CustomApiResponse(200, 'Blogs fetched succesfully', fetchedBlogs);

  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createBlogDto: CreateBlogDto, @Req() req: Request) {

    const createdBlog = await this.blogService.create(createBlogDto, req);
    return new CustomApiResponse(200, 'Blog created succesfully', createdBlog);

  }

  @UseGuards(JwtAuthGuard)
  @Get(':topicname')
  async getBlogsOfATopic(@Param('topicname') topicName: string, @Req() req: Request) {
    try {
      const topicId = await this.blogService.findTopicId(topicName); 
      
      if (!topicId) {
        throw new UnauthorizedException('Blog not found.');
      }
      
      const fetchedBlogs = await this.blogService.getBlogsOfATopic(topicId, req);
      return new CustomApiResponse(200, 'Blogs fetched succesfully', fetchedBlogs);
    } catch (error) {
      throw new Error(error);
    }

  }

  @UseGuards(JwtAuthGuard)
  @Patch(':blogname')
  async update(@Param('blogname') blogName: string,  @Body() updateBlogDto: UpdateBlogDto, @Req() req: Request) {
    try {
      const blogId = await this.blogService.findBlogId(blogName);
      if (!blogId) {
        throw new UnauthorizedException();
      }
      const updatedBlog = await this.blogService.update(blogId, updateBlogDto, req);
      return new CustomApiResponse(200, 'Blog updated succesfully', updatedBlog);
    } catch (error) {
      throw new Error('Blog Not Found');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':blogname')
  async delete(@Param('blogname') blogName: string, @Req() req: Request) {
    try {
      const blogId = await this.blogService.findBlogId(blogName);
      if (!blogId) {
        throw new UnauthorizedException();
      }
            
      const deletedBlog = await this.blogService.delete(blogId, req);
      return new CustomApiResponse(200, 'Blog deleted succesfully', deletedBlog);
    } catch (error) {
      throw new Error('Something Unexpected Occured')
    }
  }
}
