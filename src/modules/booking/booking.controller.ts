import { Body, Controller, Get, HttpStatus, Post, Query, Req, Res, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { BookingDTO } from 'src/dto/booking.dto';
import { RolesGuard } from '../../common/guards/roles.guard';
import { HasRoles } from '../../common/custom-decorators/has-roles.decorator';
import { Role } from '../../common/enum/role.enum';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { BookingService } from './booking.service';


@Controller('booking')

export class BookingController {
  constructor(private service: BookingService) { }

  @Get('all')
  async AllBookings(@Res() res: Response){
    const bookings = await this.service.AllBookings()
    return res.status(HttpStatus.OK).send({
      message: 'Bookings fetch successfully',
      bookings: bookings
    });
  }

  @Post('tour')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @HasRoles(Role.User)
  @UsePipes(new ValidationPipe())
  async BookTour(@Body() body: BookingDTO, @Req() request: Request, @Res() res: Response) {
    
    const booking = await this.service.BookTour(body, request)
    return res.status(HttpStatus.OK).send({
      message: booking.message,
      booking : booking.booking === false ? "" : booking
    });

  }
  @Post('payment')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @HasRoles(Role.User)
  async BookTourPaymentAfterApprove(@Body() body: BookingDTO, @Req() request: Request, @Res() res: Response) {
    
    const booking = await this.service.BookTourPaymentAfterApprove(body, request)
    return res.status(HttpStatus.OK).send({
      message: '',
      booking : booking
    });

  }

  @Post('availability')
  async BookingAvailability(@Body() request: Request, @Res() res: Response) {
    
    const availability = await this.service.BookingAvailability(request)
    return res.status(HttpStatus.OK).send({
      message: '',
      availability: availability
    });

  }
  @Get('available-dates')
  async AvailableDates(@Query('tour_id') tour_id: string, @Res() res: Response) {
    
    const availability = await this.service.AvailableDates(tour_id)
    return res.status(HttpStatus.OK).send({
      message: 'Available Dates fetch successfully',
      availability: availability
    });

  }
  @Post('updated-availability')
  async UpdatedBookingAvailability(@Body() request: Request, @Res() res: Response) {
    
    const availability = await this.service.UpdatedBookingAvailability(request)
    return res.status(HttpStatus.OK).send({
      message: '',
      availability: availability
    });

  }

  @Get('user/upcoming')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @HasRoles(Role.User)
  async UpComingUserBookings(@Req() req: Request, @Res() res: Response){
    const bookings = await this.service.UpComingUserBookings(req)
    return res.status(HttpStatus.OK).send({
      message: 'Upcoming bookings fetch successfully',
      bookings: bookings
    });
  }
  @Get('user/pending')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @HasRoles(Role.User)
  async PendingUserBookings(@Req() req: Request, @Res() res: Response){
    const bookings = await this.service.PendingUserBookings(req)
    return res.status(HttpStatus.OK).send({
      message: 'Pending bookings fetch successfully',
      bookings: bookings
    });
  }
  @Get('user/rejected')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @HasRoles(Role.User)
  async RejectedUserBookings(@Req() req: Request, @Res() res: Response){
    const bookings = await this.service.RejectedUserBookings(req)
    return res.status(HttpStatus.OK).send({
      message: 'Rejected bookings fetch successfully',
      bookings: bookings
    });
  }
  @Get('user/history')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @HasRoles(Role.User)
  async UserBookingsHistory(@Req() req: Request, @Res() res: Response){
    const bookingHistories = await this.service.UserBookingsHistory(req)
    return res.status(HttpStatus.OK).send({
      message: 'Bookings history fetch successfully',
      bookingHistories: bookingHistories
    });
  }


  @Get('vendor/upcoming')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @HasRoles(Role.Vendor)
  async UpComingVendorBookings(@Req() req: Request, @Res() res: Response){
    const upcomingBookings = await this.service.UpComingVendorBookings(req)
    return res.status(HttpStatus.OK).send({
      message: 'Upcoming bookings fetch successfully',
      upcomingBookings: upcomingBookings
    });
  }

  @Get('vendor/requested')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @HasRoles(Role.Vendor)
  async RequestedBookings(@Req() req: Request, @Res() res: Response) {
    const requestedBookings = await this.service.RequestedVendorBookings(req)
    return res.status(HttpStatus.OK).send({
      message: 'Requested bookings fetch successfully',
      requestedBookings: requestedBookings
    })
  }
  @Post('vendor/requested/status')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @HasRoles(Role.Vendor)
  async UpdateRequestedBookingStatus(@Req() req: Request, @Res() res: Response) {
    const requestedBookings = await this.service.UpdateRequestedBookingStatus(req)
    return res.status(HttpStatus.OK).send({
      message: 'Requested booking status updated successfully',
      requestedBookings
    })
  }

  @Get('vendor/history')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @HasRoles(Role.Vendor)
  async VendorBookingsHistory(@Req() req: Request, @Res() res: Response){
    const bookingHistories = await this.service.VendorBookingsHistory(req)
    return res.status(HttpStatus.OK).send({
      message: 'Bookings history fetch successfully',
      bookingHistories: bookingHistories
    });
  }

  @Get('vendor/stats')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @HasRoles(Role.Vendor)
  async VendorBookingStats(@Req() req: Request, @Res() res: Response){
    const stats = await this.service.VendorBookingStats(req)
    return res.status(HttpStatus.OK).send({
      message: 'Stats fetch successfully',
      stats: stats
    });
  }
}
