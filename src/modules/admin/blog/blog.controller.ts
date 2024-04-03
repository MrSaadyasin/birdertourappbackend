import { Body, Controller, Delete, Get, HttpStatus, Patch, Post, Put, Query, Req, Res, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { HasRoles } from '../../../common/custom-decorators/has-roles.decorator';
import { Role } from '../../../common/enum/role.enum';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { BlogService } from './blog.service';
import { BlogDTO } from 'src/dto/blog.dto';
import { FilesInterceptor } from 'src/common/interceptors/files.interceptor';


@Controller('blog')

export class BlogController {
  constructor(private service: BlogService) { }

@Get('list')
async BlogList(@Res() res: Response) {

  const blogs = await this.service.BlogList()
  return res.status(HttpStatus.OK).send({
    message: 'Blogs fetch successfully',
    blogs
  });

}


  @Post('add')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @HasRoles(Role.Admin)
  @UsePipes(new ValidationPipe())
  @UseInterceptors(FilesInterceptor)
  async BlogCreate(@Body() body: BlogDTO, @Req() request: Request, @Res() res: Response) {

    const blog = await this.service.BlogCreate(body, request)
    return res.status(HttpStatus.OK).send({
      message: 'Blog created successfully',
      blog
    });

  }

  @Delete('delete')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @HasRoles(Role.Admin)
  async BlogDelete(@Query('id') id: string, @Res() res: Response) {
    await this.service.BlogDelete(id)
    return res.status(HttpStatus.OK).send({
      message: 'Blog deleted successfully'
    })
  }

  @Put('edit')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @HasRoles(Role.Admin)
  async BlogEdit(@Query('slug') slug: string, @Res() res: Response) {
    const blog = await this.service.BlogEdit(slug)
    return res.status(HttpStatus.OK).send({
      message: 'Blog fetch successfully',
      blog: blog
    })
  }

  @Patch('update')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @HasRoles(Role.Admin)
  @UseInterceptors(FilesInterceptor)
  async BlogUpdate(@Query('slug') slug: string, @Req() request: Request, @Res() res: Response) {
    const blog = await this.service.BlogUpdate(slug, request)
    return res.status(HttpStatus.OK).send({
      message: 'Blog updated successfully',
      blog: blog
    })
  }

  @Get('detail')
  async BlogDetail(@Res() res: Response,@Query('slug') slug: string) {
    const blog = await this.service.BlogDetail(slug)
    return res.status(HttpStatus.OK).send({
      message: 'Blog fetch successfully',
      blog
    });
  
  }

}