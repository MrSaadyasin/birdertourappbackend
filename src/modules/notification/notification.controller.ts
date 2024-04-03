import { Body, ClassSerializerInterceptor, Controller, Get, HttpStatus, Post, Req, Res, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';

import { Request, Response } from 'express';
import { NotificationService } from './notification.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/common/guards/roles.guard';


@Controller('notification')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class NotificationController {
  constructor(private service: NotificationService) { }

 

  @Post('send')
//   @HasRoles(Role.User , Role.Vendor)
  async Add(@Res() res: Response, @Req() request: Request) {
     
    await this.service.sendNotification('admin','for admin side', undefined, "64958f0c932cb7cb3fa7fc8d")
    return res.status(HttpStatus.OK).send({
      message: 'notification send'
    });

  }

  @Get('general')
  async getGeneralNotifications(@Res() res : Response, @Req() request: Request){
   const notificaions = await this.service.getGeneralNotificaions(request)
   return res.status(HttpStatus.OK).send({
    message: 'Notification fetch Successfully',
    notificaions : notificaions
  });
  }

}
