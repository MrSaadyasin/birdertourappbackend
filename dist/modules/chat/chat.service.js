"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const Pusher = require("pusher");
const notification_service_1 = require("../notification/notification.service");
let ChatService = class ChatService {
    constructor(chatModel, notificationService) {
        this.chatModel = chatModel;
        this.notificationService = notificationService;
        this.pusher = new Pusher({
            appId: process.env.PUSHER_APP_ID,
            key: process.env.PUSHER_APP_KEY,
            secret: process.env.PUSHER_SECRET_KEY,
            cluster: process.env.PUSHER_CLUSTER,
            useTLS: true,
        });
    }
    async chat(body) {
        try {
            const { message, user, vendor, type, sender, receiver } = body;
            let channelName = '';
            if (user && type === 'user') {
                channelName = `${process.env.NOTIFICATION_CHANNEL_NAME}-${vendor}`;
            }
            else if (vendor && type === 'vendor') {
                channelName = `${process.env.NOTIFICATION_CHANNEL_NAME}-${user}`;
            }
            const chat = await this.chatModel.create({
                user: user,
                vendor: vendor,
                message: message,
                type: type,
                channel_name: channelName,
                sender: sender,
                receiver: receiver
            });
            this.pusher.trigger(channelName, 'message-event', {
                chat
            });
            return chat;
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async chatProfileList(request) {
        try {
            const authUser = request['user'];
            let chats = [];
            if (authUser.role === 'user') {
                chats = await this.chatModel.find({
                    user: authUser.id
                }).sort({ createdAt: -1 }).populate('vendor', 'name profile_image badge');
            }
            else if (authUser.role === 'vendor') {
                chats = await this.chatModel.find({
                    vendor: authUser.id
                }).sort({ createdAt: -1 }).populate('user', 'name profile_image badge');
            }
            let uniqueChatsMap = new Map();
            let unreadCountMap = new Map();
            chats.forEach(chat => {
                let key;
                if (authUser.role === 'user') {
                    key = chat.user._id.toString() + chat.vendor;
                }
                else if (authUser.role === 'vendor') {
                    key = chat.vendor + chat.user._id.toString();
                }
                if (!chat.is_read && chat.receiver.toString() === authUser.id) {
                    if (!unreadCountMap.has(key)) {
                        unreadCountMap.set(key, 1);
                    }
                    else {
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
                }
                else if (authUser.role === 'vendor') {
                    key = chat.vendor + chat.user._id.toString();
                }
                return Object.assign(Object.assign({}, chat._doc), { unreadCount: unreadCountMap.get(key) || 0 });
            });
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async chatMessageList(body, request) {
        try {
            const { vendor_id, user_id } = body;
            const authUser = request['user'];
            let messages = [];
            if (authUser.role === 'user') {
                messages = await this.chatModel.find({
                    user: authUser.id,
                    vendor: vendor_id
                }).populate('vendor', 'name profile_image');
            }
            else if (authUser.role === 'vendor') {
                messages = await this.chatModel.find({
                    vendor: authUser.id,
                    user: user_id
                }).populate('user', 'name profile_image');
            }
            messages.forEach(async (message) => {
                if (message.receiver.toString() === authUser.id) {
                    await this.chatModel.updateMany({ user: user_id, vendor: vendor_id }, { is_read: true }, { new: true });
                }
            });
            return messages;
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async deleteChat(body) {
        const { vendor_id, user_id } = body;
        await this.chatModel.deleteMany({ user: user_id, vendor: vendor_id });
    }
};
ChatService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Chat')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        notification_service_1.NotificationService])
], ChatService);
exports.ChatService = ChatService;
//# sourceMappingURL=chat.service.js.map