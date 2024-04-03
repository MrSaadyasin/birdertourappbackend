import { Body, Controller, Get, HttpStatus, Post, Query, Redirect, Req, Res, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { RolesGuard } from '../../common/guards/roles.guard';
import { HasRoles } from '../../common/custom-decorators/has-roles.decorator';
import { Role } from '../../common/enum/role.enum';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { PaymentDto } from 'src/dto/payment.dto';
import { PaymentService } from './payment.service';
import { VendorPaymentDTO } from 'src/dto/vendorPayment.dto';


@Controller('payment')

export class PaymentController {
  constructor(private service: PaymentService) { }

  @Post('update-status')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @HasRoles(Role.User)
  @UsePipes(new ValidationPipe())
  async createBooking(@Body() paymentDto: PaymentDto, @Res() res: Response) {

    const payment = await this.service.createBooking(paymentDto)
    return res.status(HttpStatus.OK).send({
      message: 'Payment status updated successfully'
    })
  }
  @Get('vendor/connect-stripe')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @HasRoles(Role.Vendor)
  async connectWithStripe(@Res() res: Response, @Req() req: Request) {
    const url = await this.service.connectWithStripe(req)
    return res.status(HttpStatus.OK).send({
      url: url
    })
  }


  @Get('callback')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @HasRoles(Role.Vendor)
  async oauthCallback(@Query('code') code: string, @Req() req: Request, @Res() res: Response) {

    const vendor = await this.service.createConnectAccount(code, req)
    return res.status(HttpStatus.OK).send({
      message: 'Stripe connected successfully',
      vendor: vendor
    })

  }

  @Post('request')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @HasRoles(Role.Vendor)
  async paymentRequest(@Body() body: Request, @Res() res: Response, @Req() req: Request) {
    const booking = await this.service.paymentRequest(body, req)
    return res.status(HttpStatus.OK).send({
      message: 'Payment request send successfully',
      booking: booking
    })
  }
  @Get('tour/request')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @HasRoles(Role.Admin)
  async paymentTourRequest(@Res() res: Response) {
    const paymentRequests = await this.service.paymentTourRequest()
    return res.status(HttpStatus.OK).send({
      message: 'Payment requests fetch successfully',
      paymentRequests: paymentRequests
    })
  }
  @Post('vendor')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @HasRoles(Role.Admin)
  async sendVendorPayment(@Body() body: Request, @Res() res: Response) {
    const stripeSession = await this.service.sendVendorPayment(body)
    return res.status(HttpStatus.OK).send({
      // message: '',
      stripeSession: stripeSession
    })
  }

  @Post('vendor/update-status')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @HasRoles(Role.Admin)
  async updateVendorPaymentStatus(@Body() vendorPaymentDto: VendorPaymentDTO, @Res() res: Response) {

    await this.service.updateVendorPaymentStatus(vendorPaymentDto)
    return res.status(HttpStatus.OK).send({
      message: 'Payment status updated successfully'
    })
  }

  @Get('vendor/history')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @HasRoles(Role.Vendor)
  async vendorPaymentHistory(@Req() request: Request, @Res() res: Response) {
    const paymentHistory = await this.service.vendorPaymentHistory(request)
    return res.status(HttpStatus.OK).send({
      message: 'Payment history get successfully',
      paymentHistory: paymentHistory
    })
  }

  @Get('vendor/stats')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @HasRoles(Role.Vendor)
  async vendorPaymentStats(@Req() request: Request, @Res() res: Response) {
    const paymentStats = await this.service.vendorPaymentStats(request)
    return res.status(HttpStatus.OK).send({
      message: 'Payment stats get successfully',
      paymentStats: paymentStats
    })
  }

  @Get('admin/stats')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @HasRoles(Role.Admin)
  async adminPaymentStats(@Req() request: Request, @Res() res: Response) {
    const paymentStats = await this.service.adminPaymentStats(request)
    return res.status(HttpStatus.OK).send({
      message: 'Payment stats get successfully',
      paymentStats: paymentStats
    })
  }

}
 