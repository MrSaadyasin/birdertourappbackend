import { Body, Controller, Get, HttpException, HttpStatus, Post, Req, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { RolesGuard } from '../../common/guards/roles.guard';
import { HasRoles } from '../../common/custom-decorators/has-roles.decorator';
import { Role } from '../../common/enum/role.enum';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { WishListService } from './wishlist.service';
import { WishListDTO } from 'src/dto/wishlist.dto';



@Controller('wishlist')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class WishListController {
  constructor(private service: WishListService) { }

  @Get('all')
  @HasRoles(Role.User)
  async getAll(@Req() req: Request,@Res() res: Response) {
    const wishlists = await this.service.getAll(req)
    return res.status(HttpStatus.OK).send({
      message: 'Wishlist fetch successfully',
      wishlists: wishlists
    })
  }

  @Post('tour')
  @HasRoles(Role.User)
  @UsePipes(new ValidationPipe())
  async tour(@Body() req: WishListDTO, @Res() res: Response, @Req() request: Request) {
    const wishlist = await this.service.tour(req, request)
    return res.status(HttpStatus.OK).send({
      message: wishlist ? 'Tour has been added in wishlist' : 'Tour removed from wishlist',
    });

  }


}
