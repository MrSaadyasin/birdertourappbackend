import { Body, Controller, Get, HttpStatus, Post, Req, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { FeedBackDTO } from '../../dto/feedback.dto';
import { RolesGuard } from '../../common/guards/roles.guard';
import { HasRoles } from '../../common/custom-decorators/has-roles.decorator';
import { Role } from '../../common/enum/role.enum';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { FeedBackService } from './feedback.service';


@Controller('feedback')

export class FeedBackController {
  constructor(private service: FeedBackService) { }

  @Get('all')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async GetAll(@Res() res: Response) {
    const tours = await this.service.getAll();
    return res.status(HttpStatus.OK).send({
      message: 'Feedback get successfull',
      tours: tours
    })
  }

  @Post('add')
  // @HasRoles(Role.User , Role.Vendor)
  @UsePipes(new ValidationPipe())
  async Add(@Body() req: FeedBackDTO, @Res() res: Response, @Req() request: Request) {

    await this.service.add(req)
    return res.status(HttpStatus.OK).send({
      message: 'Feedback submitted successfully'
    });

  }

  @Get('pending')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @HasRoles(Role.User)
  async PendingFeedBack(@Res() res: Response, @Req() request: Request) {

    const pendingFeedbacks = await this.service.pendingFeedBack(request)
    return res.status(HttpStatus.OK).send({
      message: '',
      pendingFeedbacks: pendingFeedbacks
    });

  }

}
