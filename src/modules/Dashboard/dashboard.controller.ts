import { Body, Controller, Get, HttpStatus, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { HasRoles } from 'src/common/custom-decorators/has-roles.decorator';
import { Role } from 'src/common/enum/role.enum';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { DashboardService } from './dashboard.service';


@Controller('dashboard')
@UseGuards(AuthGuard('jwt'), RolesGuard)

export class DashboardController {
    constructor(private service: DashboardService) { }


    @Get('admin/stats')
    @HasRoles(Role.Admin)
    async dashboardStats(@Res() res: Response) {
        const stats = await this.service.dashboardStats();
        return res.status(HttpStatus.OK).send({
            message: 'Dashboard stats fetch successfully',
            stats: stats
        })
    }

    @Post('mail/groups')
    @HasRoles(Role.Admin)
    async getAllMailGroup(@Body() body : Request, @Res() res: Response){
     const mailGroup = await this.service.getAllMailGroup(body)
      return res.status(HttpStatus.OK).send({
        message: 'Mail-group get successfully',
        mailGroup : mailGroup
      })
    }
  

}
