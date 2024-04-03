import { Body, Controller, Get, HttpStatus, Post, Query, Redirect, Req, Res, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { UserDTO } from '../../dto/user.dto';
import { AuthGuard } from '@nestjs/passport';
import { GoogleStrategy, GoogleVendorStrategy } from 'src/strategies/google.strategy';
import { UseFacebookAuth, FacebookAuthResult } from '@nestjs-hybrid-auth/facebook';
import { FilesInterceptor } from 'src/common/interceptors/files.interceptor';
import { HasRoles } from 'src/common/custom-decorators/has-roles.decorator';
import { Role } from 'src/common/enum/role.enum';
import { RolesGuard } from 'src/common/guards/roles.guard';




@Controller('auth')
export class AuthController {
  constructor(private service: AuthService,
    private readonly googleAuthService: GoogleStrategy,
    private readonly googleVendorAuthService: GoogleVendorStrategy) { }


  @Post('register')
  @UsePipes(new ValidationPipe())                 // for implement the validation that uses in dto file we use ValidationPipe()
  async Register(@Body() req: UserDTO, @Res() res: Response) {
    const user = await this.service.register(req);
    return res.status(HttpStatus.OK).send({
      message: 'Register Successfully'
    })
  }

  @Post('login')
  async login(@Req() req: Request, @Res() res: Response) {

    const user = await this.service.login(req);
    const token = await this.service.signPayload(user);
    await this.service.setCookieToken(token, res)

    return res.status(HttpStatus.OK).send({ user, token });

  }

  @Get('logout')
  @UseGuards(AuthGuard('jwt'))
  async Logout(@Res() res: Response) {
    await this.service.logout(res)
    return res.status(HttpStatus.OK).send({
      message: 'Logout Successfully',

    });
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  async GetProfile(@Req() req: UserDTO, @Res() res: Response) {
    const profile = await this.service.getProfile(req)
    return res.status(HttpStatus.OK).send({
      message: ' Profile Get Successfully',
      user: profile
    })
  }

  @Post('update-profile')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @HasRoles(Role.Vendor, Role.User)
  @UseInterceptors(FilesInterceptor)
  async updateProfile(@Req() req: Request, @Res() res: Response) {
    const user = await this.service.updateProfile(req)
    return res.status(HttpStatus.OK).send({
      message: 'Profile Update Successfully',
      user: user
    })
  }

  @Post('forget-password')
  async ForgotPassword(@Req() req: Request, @Res() res: Response) {
    await this.service.forgotPassword(req)
    return res.status(HttpStatus.OK).send({
      message: 'Please Check you email for reset-password'
    })
  }

  @Post('reset-password')
  async ResetPassword(
    @Body() req: any, @Res() res: Response) {
    await this.service.resetPassword(req)
    return res.status(HttpStatus.OK).send({
      message: 'Password Update Successfully'
    })

  }

  @Post('update-password')
  @UseGuards(AuthGuard('jwt'))
  async UpdatePassword(
    @Req() req: Request, @Res() res: Response) {
    await this.service.updatePassword(req)
    return res.status(HttpStatus.OK).send({
      message: 'Password Update Successfully'
    })

  }
  @Get('vendors')
  async allVendors(@Res() res: Response) {
    const vendors = await this.service.allVendors()
    return res.status(HttpStatus.OK).send({
      message: 'Vendors fetch successfully',
      vendors: vendors
    })
  }

  @Get('google')
  @Redirect()
  async googleAuth() {
    const consentUrl = this.googleAuthService.createConsentUrl();
    return { url: consentUrl };
  }

  @Get('google-vendor')
  @Redirect()
  async googleVendorAuth() {
    const consentUrl = this.googleVendorAuthService.createConsentUrl();
    return { url: consentUrl };

  }

  @Get('google/callback')
  async googleAuthRedirect(@Query('code') code: string, @Query('role') role: string, @Res() res: Response) {
    const Checkeduser = await this.googleAuthService.authenticate(code);
    Checkeduser.role = role;

    const user = await this.service.CheckSocialUser(Checkeduser)
    const token = await this.service.signPayload(user);
    await this.service.setCookieToken(token, res)
    return res.status(HttpStatus.OK).send({ user, token });

  }

  @Get('google/callback-vendor')
  async googleVendorAuthRedirect(@Query('code') code: string, @Query('role') role: string, @Res() res: Response) {
    const Checkeduser = await this.googleVendorAuthService.authenticate(code);
    Checkeduser.role = role;

    const user = await this.service.CheckSocialUser(Checkeduser)
    const token = await this.service.signPayload(user);
    await this.service.setCookieToken(token, res)
    return res.status(HttpStatus.OK).send({ user, token });

  }
  @UseFacebookAuth()
  @Get('facebook')
  LoginWithFacebook() {

  }


  @UseFacebookAuth()
  @Get('facebook/callback')
  async FacebookCallback(@Query('role') role, @Res() res: Response, @Req() req): Promise<void> {
    const result: FacebookAuthResult = req.hybridAuthResult;
    const profile = result.profile._json
    profile.role = role;
    let user = await this.service.CheckFacebookSocialUser(profile)
    const token = await this.service.signPayload(user);
    await this.service.setCookieToken(token, res)
    res.status(HttpStatus.OK).send({ user, token });
  }

}
