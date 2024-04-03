import { Body, Controller, Get, HttpStatus, Post, Query, Res, UseGuards } from '@nestjs/common';
import { AdminTourService } from './admin-tour.service';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { HasRoles } from 'src/common/custom-decorators/has-roles.decorator';
import { Role } from '../../../common/enum/role.enum';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';


@Controller('admin/tour')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@HasRoles(Role.Admin)
export class AdminTourController {
  constructor(private service: AdminTourService) { }

  @Get('pending')
  async getPendingTours(@Res() res: Response) {
    const tours = await this.service.getPendingTours();
    return res.status(HttpStatus.OK).send({
      message: 'Pending Tours Fetch Successfully',
      tours: tours
    })
  }

  @Get('edited')
  async getEditedTours(@Res() res: Response) {
    const tours = await this.service.getEditedTours();
    return res.status(HttpStatus.OK).send({
      message: 'Edited Tours Fetch Successfully',
      tours: tours
    })
  }

  @Get('approved')
  async getApprovedTours(@Res() res: Response) {
    const tours = await this.service.getApprovedTours();
    return res.status(HttpStatus.OK).send({
      message: 'Approved Tours Fetch Successfully',
      tours: tours
    })
  }

  @Get('rejected')
  async getRejectedTours(@Res() res: Response) {
    const tours = await this.service.getRejectedTours();
    return res.status(HttpStatus.OK).send({
      message: 'Rejected Tours Fetch Successfully',
      tours: tours
    })
  }



  @Post('update-status')
  async updateStatus(@Body() req: Request, @Res() res: Response) {
    const updatedTour = await this.service.updateStatus(req);
    return res.status(HttpStatus.OK).send({
      message: 'Status update successfully',
      tour: updatedTour
    })
  }

  @Get('search-keywords')
  async getKeywords(@Res() res: Response) {
    const keywords = await this.service.searchKeywords()
    return res.status(HttpStatus.OK).send({
      message: 'Keywords fetch successfully',
      keywords
    })
  }

  @Get('search-top-keywords-countries')
  async getTopSearchCountries(@Res() res: Response) {
    const keywords = await this.service.getTopSearchKeywords()
    return res.status(HttpStatus.OK).send({
      message: 'Top search keywords countries fetch successfully',
      keywords
    })
  }


}
