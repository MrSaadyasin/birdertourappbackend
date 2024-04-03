import { Body, ClassSerializerInterceptor, Controller, Get, HttpStatus, Post, Req, Res, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';

import { Request, Response } from 'express';
import { ChatService } from './chat.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/common/guards/roles.guard';


@Controller('chat')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class ChatController {
  constructor(private service: ChatService) { }


  @Post()
  // @UseInterceptors(ClassSerializerInterceptor)
  async sendMessage(@Body() body: Request, @Res() res: Response) {
    const chat = await this.service.chat(body)
    return res.status(HttpStatus.OK).send({
      message: 'chat',
      chat: chat
    });

  }

  @Get('list')
  async chatProfileList(@Res() res: Response, @Req() request: Request) {
    const chatProfileList = await this.service.chatProfileList(request)
    return res.status(HttpStatus.OK).send({
      message: 'Chat profile list fetch successfully',
      profileList: chatProfileList
    });
  }

  @Post('message')
  async chatMessageList(@Body() body: Request, @Res() res: Response, @Req() request: Request) {
    const chatMessageList = await this.service.chatMessageList(body, request)
    return res.status(HttpStatus.OK).send({
      message: 'Chat fetch successfully',
      chatMessageList: chatMessageList
    });
  }

 
  @Post('delete')
  async deleteChat(@Body() body: Request, @Res() res: Response) {
    await this.service.deleteChat(body)
    return res.status(HttpStatus.OK).send({
      message: 'Chat deleted successfully',
    });

  }

}
