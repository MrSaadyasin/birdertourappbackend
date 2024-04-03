import { Body, Controller, Get, HttpStatus, Post, Query, Redirect, Req, Res, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { RolesGuard } from '../../common/guards/roles.guard';
import { HasRoles } from '../../common/custom-decorators/has-roles.decorator';
import { Role } from '../../common/enum/role.enum';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { TermsConditionDTO } from 'src/dto/termsCondition.dto';
import { TermsConditionService } from './termsCondition.service';



@Controller('')

export class TermsConditionController {
  constructor(private service: TermsConditionService) { }

  @Get('terms-condition')
  async get( @Res() res: Response) {

    const termsCondition = await this.service.get()
    return res.status(HttpStatus.OK).send({
      message: 'Terms Condition added successfully',
      termsCondition : termsCondition
    })
  }



  @Post('terms-condition/update')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @HasRoles(Role.Admin)
  @UsePipes(new ValidationPipe())
  async createOrUpdate(@Body() termsConditionDto: TermsConditionDTO, @Res() res: Response) {

     await this.service.createOrUpdate(termsConditionDto)
    return res.status(HttpStatus.OK).send({
      message: 'Terms Condition updated successfully'
    })
  }

  @Get('top-vendors')
  async topVendors(@Res() res: Response) {

    const topVendors = await this.service.topVendors()
   return res.status(HttpStatus.OK).send({
     message: 'Top Vendors fetch successfully',
     topVendors : topVendors
   })
 }

}
 