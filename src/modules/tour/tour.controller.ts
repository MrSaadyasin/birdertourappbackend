import { Body, Controller, Get, HttpStatus, Patch, Post, Put, Query, Req, Res, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { TourService } from './tour.service';
import { RolesGuard } from '../../common/guards/roles.guard';
import { HasRoles } from 'src/common/custom-decorators/has-roles.decorator';
import { Role } from '../../common/enum/role.enum';
import { AuthGuard } from '@nestjs/passport';
import { FilesInterceptor } from 'src/common/interceptors/files.interceptor';
import { TourDTO } from 'src/dto/tour.dto';
import { Request, Response } from 'express';
import { TourSearchDTO } from 'src/dto/tour-search.dto';



@Controller('tour')



export class TourController {
  constructor(private service: TourService) { }

  @Get('all')
  async getAllTours(@Res() res: Response) {
    const tours = await this.service.getAll();
    return res.status(HttpStatus.OK).send({
      message: 'Tours Fetch Successfully',
      tours: tours
    })
  }

  @Get('upcoming')
  async UpComingTours(@Res() res: Response) {
    const tours = await this.service.upComingsTours();
    return res.status(HttpStatus.OK).send({
      message: 'UpComing Tours Fetch Successfully',
      tours: tours
    })
  }
  @Post('search-by-vendor-or-location')
  async searchTour(@Body() body: TourSearchDTO, @Res() res: Response, @Req() request: Request) {
    const tours = await this.service.searchTour(body, request);
    return res.status(HttpStatus.OK).send({
      message: 'Tours get Successfully',
      tours: tours
    })
  }

  @Get('pending')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @HasRoles(Role.Vendor)
  async getPendingTours(@Req() req: Request, @Res() res: Response) {
    const tours = await this.service.getPendingTours(req);
    return res.status(HttpStatus.OK).send({
      message: 'Pending Tours Fetch Successfully',
      tours: tours
    })
  }

  @Get('approved')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @HasRoles(Role.Vendor)
  async getApprovedTours(@Req() req: Request, @Res() res: Response) {
    const tours = await this.service.getApprovedTours(req);
    return res.status(HttpStatus.OK).send({
      message: 'Approved Tours Fetch Successfully',
      tours: tours
    })
  }
  @Get('edited')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @HasRoles(Role.Vendor)
  async getEditedTours(@Req() req: Request, @Res() res: Response) {
    const tours = await this.service.getEditedTours(req);
    return res.status(HttpStatus.OK).send({
      message: 'Edited Tours Fetch Successfully',
      tours: tours
    })
  }

  @Get('rejected')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @HasRoles(Role.Vendor)
  async getRejectedTours(@Req() req: Request, @Res() res: Response) {
    const tours = await this.service.getRejectedTours(req);
    return res.status(HttpStatus.OK).send({
      message: 'Rejected Tours Fetch Successfully',
      tours: tours
    })
  }

  @Post('create')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @HasRoles(Role.Vendor)
  @UsePipes(new ValidationPipe())
  @UseInterceptors(FilesInterceptor)   // for Multipart file systems
  async create(
    @Req() request: Request,
    @Body() req: TourDTO, @Res() res: Response) {


    const tour = await this.service.create(req, request)
    if (!tour) {
      return res.status(HttpStatus.BAD_REQUEST).send({
        message: 'Something went wrong'
      })
    }
    await this.service.createTourPricing(tour, req);
    return res.status(HttpStatus.OK).send({
      message: 'Tour created successfully',

    });

  }
  @Patch('update')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @HasRoles(Role.Vendor)
  @UsePipes(new ValidationPipe())
  @UseInterceptors(FilesInterceptor)   // for Multipart file systems
  async updateTour(@Req() req: Request, @Query('id') id: string, @Body() body: TourDTO, @Res() res: Response) {
    const tour = await this.service.updateTour(id, body, req)
    if (!tour) {
      return res.status(HttpStatus.BAD_REQUEST).send({
        message: 'Something went wrong'
      })
    }
    await this.service.updateTourPricing(tour, body);
    return res.status(HttpStatus.OK).send({
      message: 'Tour updated successfully',

    });

  }


  @Get('detail')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @HasRoles(Role.Vendor)
  async getTourDetail(@Query('tour_id') tour_id: string, @Req() req: Request, @Res() res: Response) {
    const tour = await this.service.getTourDetail(req, tour_id);
    return res.status(HttpStatus.OK).send({
      message: 'Tour Detail Get Successfully',
      tours: tour
    })
  }

  @Get('bookings')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @HasRoles(Role.Vendor, Role.Admin)
  async getAllBookings(@Query('tour_id') tour_id: string, @Res() res: Response) {
    const bookings = await this.service.getAllBookings(tour_id);
    return res.status(HttpStatus.OK).send({
      message: 'Bookings fetch Successfully',
      bookings: bookings
    })
  }

  @Get('details')
  async getUserTourDetail(@Query('tour_id') tour_id: string, @Res() res: Response) {
    const tour = await this.service.getUserTourDetail(tour_id);
    return res.status(HttpStatus.OK).send({
      message: 'Tour Detail Get Successfully',
      tours: tour
    })
  }

  @Get('top')
  async topTours(@Res() res: Response) {
    const tour = await this.service.topTours();
    return res.status(HttpStatus.OK).send({
      message: 'Top Tours Get Successfully',
      tours: tour
    })
  }
}
