import { Body, Controller, Get, HttpStatus, Post, Query, Req, Res, UseGuards} from '@nestjs/common';
import { AdminVendorService } from './admin-vendor.service';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { HasRoles } from 'src/common/custom-decorators/has-roles.decorator';
import { Role } from '../../../common/enum/role.enum';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { UserDTO } from 'src/dto/user.dto';


@Controller('admin/vendor')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@HasRoles(Role.Admin)
export class AdminVendorController {
  constructor(private service: AdminVendorService) { }

  @Get('pending')
  async getPendingVendors(@Res() res: Response) {
    const vendors = await this.service.getPendingVendors();
    return res.status(HttpStatus.OK).send({
      message: 'Pending Vendors Fetch Successfully',
      vendors: vendors
    })
  }

  @Get('approved')
  async getApprovedVendors(@Res() res: Response) {
    const vendors = await this.service.getApprovedVendors();
    return res.status(HttpStatus.OK).send({
      message: 'Approved Vendors Fetch Successfully',
      vendors: vendors
    })
  }

  @Get('rejected')
  async getRejectedVendors(@Res() res: Response) {
    const vendors = await this.service.getRejectedVendors();
    return res.status(HttpStatus.OK).send({
      message: 'Rejected Vendors Fetch Successfully',
      vendors: vendors
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

  @Get('user-list')
  async getAllUserList(@Res() res: Response){
    const userList = await this.service.getAllUserList()
    return res.status(HttpStatus.OK).send({
      message: 'User list fetch successfully',
      userList: userList
    })
  }


  @Get('detail')
  async getVendorDetail(@Query('vendor_id') vendor_id: string, @Res() res: Response) {
    const vendorDetail = await this.service.getVendorDetail(vendor_id);
    return res.status(HttpStatus.OK).send({
      message: 'Vendor detail fetch successfully',
      vendorDetail: vendorDetail
    })
  }

  @Post('add/badge')
  async addBadge(@Body() body : Request, @Res() res: Response){
   const vendor = await this.service.addBadge(body)
    return res.status(HttpStatus.OK).send({
      message: vendor.badge === true ? 'Badge added successfully' : 'Badge removed successfully',
      vendor : vendor
    })
  }

}
