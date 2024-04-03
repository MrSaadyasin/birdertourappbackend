import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat } from 'src/model/chat.model';
import * as Pusher from 'pusher';
import { User } from 'src/model/user.model';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class ChatService {
  private pusher: Pusher

  constructor(
    @InjectModel('Chat') private readonly chatModel: Model<Chat>,
    private notificationService: NotificationService,

  ) {
    this.pusher = new Pusher({
      appId: process.env.PUSHER_APP_ID,
      key: process.env.PUSHER_APP_KEY,
      secret: process.env.PUSHER_SECRET_KEY,
      cluster: process.env.PUSHER_CLUSTER,
      useTLS: true,
    });

  }


  // async chat(message: string, sender: string = undefined, recipient: string = undefined, type: string = undefined) {
  async chat(body: any) {
    try {
      const { message, user, vendor, type, sender, receiver } = body
      //  let channelName = `${process.env.NOTIFICATION_CHANNEL_NAME}-${recipient}`
      let channelName = ''
      if (user && type === 'user') {    // user, 
        channelName = `${process.env.NOTIFICATION_CHANNEL_NAME}-${vendor}`
      } else if (vendor && type === 'vendor') {
        channelName = `${process.env.NOTIFICATION_CHANNEL_NAME}-${user}`
      }
      const chat = await this.chatModel.create({
        user: user,
        vendor: vendor,
        message: message,
        type: type,
        channel_name: channelName,
        sender: sender,
        receiver: receiver
      })
      this.pusher.trigger(channelName, 'message-event', {
        chat
      })
      return chat
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST)
    }

  }

  async chatProfileList(request: any) {
    try {
      const authUser = request['user']
      let chats = []

      if (authUser.role === 'user') {
        chats = await this.chatModel.find({
          user: authUser.id
        }).sort({ createdAt: -1 }).populate('vendor', 'name profile_image badge')
      } else if (authUser.role === 'vendor') {
        chats = await this.chatModel.find({
          vendor: authUser.id
        }).sort({ createdAt: -1 }).populate('user', 'name profile_image badge')
      }

      let uniqueChatsMap = new Map();
      let unreadCountMap = new Map();

      chats.forEach(chat => {
        let key;
        if (authUser.role === 'user') {
          key = chat.user._id.toString() + chat.vendor;
        } else if (authUser.role === 'vendor') {
          key = chat.vendor + chat.user._id.toString();
        }
        if (!chat.is_read && chat.receiver.toString() === authUser.id) {
          if (!unreadCountMap.has(key)) {
            unreadCountMap.set(key, 1);
          } else {
            unreadCountMap.set(key, unreadCountMap.get(key) + 1);
          }
        }

        if (!uniqueChatsMap.has(key)) {
          uniqueChatsMap.set(key, chat);
        }
      });

      const uniqueChats = Array.from(uniqueChatsMap.values());

      return uniqueChats.map(chat => {
        let key;
        if (authUser.role === 'user') {
          key = chat.user._id.toString() + chat.vendor;
        } else if (authUser.role === 'vendor') {
          key = chat.vendor + chat.user._id.toString();
        }
        return {
          ...chat._doc,
          unreadCount: unreadCountMap.get(key) || 0
        };
      });
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST)
    }

  }
  async chatMessageList(body: any, request: any) {

    try {
      const { vendor_id, user_id } = body
      const authUser = request['user']
      let messages = []

      if (authUser.role === 'user') {
        messages = await this.chatModel.find({
          user: authUser.id,
          vendor: vendor_id
        }).populate('vendor', 'name profile_image')
      }
      else if (authUser.role === 'vendor') {
        messages = await this.chatModel.find({
          vendor: authUser.id,
          user: user_id
        }).populate('user', 'name profile_image')
      }
      messages.forEach(async message => {
        if (message.receiver.toString() === authUser.id) {
          await this.chatModel.updateMany({ user: user_id, vendor: vendor_id }, { is_read: true }, { new: true })
        }

      })

      return messages
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST)
    }

  }


  async deleteChat(body: any) {
    const { vendor_id, user_id } = body
    await this.chatModel.deleteMany({ user: user_id, vendor: vendor_id })
  }
}