import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as Pusher from 'pusher';
import { Notification } from 'src/model/notification.model';

@Injectable()
export class NotificationService {
  private pusher: Pusher;

  constructor(@InjectModel('Notification') private readonly notificationModel: Model<Notification>) {
    this.pusher = new Pusher({
      appId: process.env.PUSHER_APP_ID,
      key: process.env.PUSHER_APP_KEY,
      secret: process.env.PUSHER_SECRET_KEY,
      cluster: process.env.PUSHER_CLUSTER,
      useTLS: true,
    });

  }

  async sendNotification(title: string, message: string, user_id: string = undefined, vendor_id: string = undefined, type: string = undefined) {
    try {

      let channelName = `${process.env.NOTIFICATION_CHANNEL_NAME}-admin`
      if (user_id && type === 'user') {
        channelName = `${process.env.NOTIFICATION_CHANNEL_NAME}-${user_id}`
      } else if (vendor_id && type === 'vendor') {
        channelName = `${process.env.NOTIFICATION_CHANNEL_NAME}-${vendor_id}`
      }
      const notification = await this.notificationModel.create({
        user: user_id,
        vendor: vendor_id,
        message: message,
        title: title,
        channel_name: channelName
      })
      this.pusher.trigger(channelName, 'notification-event', {
        notification
      })
      console.log('notification send successfully')
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST)
    }

  }

  async getGeneralNotificaions(req: any) {
    let authUser = req['user']
    if (authUser.role === 'vendor' || authUser.role === 'user') {
      return await this.notificationModel.find({ channel_name: `${process.env.NOTIFICATION_CHANNEL_NAME}-${authUser.id}` }).sort({ createdAt: -1 })
    }
    else if (authUser.role === 'admin') {
      return await this.notificationModel.find({ channel_name: `${process.env.NOTIFICATION_CHANNEL_NAME}-admin` }).sort({ createdAt: -1 })
    }
  }


}