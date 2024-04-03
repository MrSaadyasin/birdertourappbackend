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
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const Pusher = require("pusher");
let NotificationService = class NotificationService {
    constructor(notificationModel) {
        this.notificationModel = notificationModel;
        this.pusher = new Pusher({
            appId: process.env.PUSHER_APP_ID,
            key: process.env.PUSHER_APP_KEY,
            secret: process.env.PUSHER_SECRET_KEY,
            cluster: process.env.PUSHER_CLUSTER,
            useTLS: true,
        });
    }
    async sendNotification(title, message, user_id = undefined, vendor_id = undefined, type = undefined) {
        try {
            let channelName = `${process.env.NOTIFICATION_CHANNEL_NAME}-admin`;
            if (user_id && type === 'user') {
                channelName = `${process.env.NOTIFICATION_CHANNEL_NAME}-${user_id}`;
            }
            else if (vendor_id && type === 'vendor') {
                channelName = `${process.env.NOTIFICATION_CHANNEL_NAME}-${vendor_id}`;
            }
            const notification = await this.notificationModel.create({
                user: user_id,
                vendor: vendor_id,
                message: message,
                title: title,
                channel_name: channelName
            });
            this.pusher.trigger(channelName, 'notification-event', {
                notification
            });
            console.log('notification send successfully');
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getGeneralNotificaions(req) {
        let authUser = req['user'];
        if (authUser.role === 'vendor' || authUser.role === 'user') {
            return await this.notificationModel.find({ channel_name: `${process.env.NOTIFICATION_CHANNEL_NAME}-${authUser.id}` }).sort({ createdAt: -1 });
        }
        else if (authUser.role === 'admin') {
            return await this.notificationModel.find({ channel_name: `${process.env.NOTIFICATION_CHANNEL_NAME}-admin` }).sort({ createdAt: -1 });
        }
    }
};
NotificationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Notification')),
    __metadata("design:paramtypes", [mongoose_2.Model])
], NotificationService);
exports.NotificationService = NotificationService;
//# sourceMappingURL=notification.service.js.map