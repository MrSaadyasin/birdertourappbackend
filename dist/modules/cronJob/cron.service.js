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
exports.CronService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const schedule_1 = require("@nestjs/schedule");
const moment = require("moment");
const mongoose_2 = require("mongoose");
const Email_service_1 = require("../../Utils/Email.service");
let CronService = class CronService {
    constructor(bookingModel, userModel, emailService) {
        this.bookingModel = bookingModel;
        this.userModel = userModel;
        this.emailService = emailService;
    }
    async vendorFeedBack() {
        try {
            const startDate = moment().startOf('day');
            await this.bookingModel.updateMany({
                payment_status: 'paid',
                feedback_status: 'pending',
                is_reminder: false,
                date: { $lte: startDate.toDate() }
            }, { $set: { feedback_status: 'inProgress' } });
            const toUpdateBookings = await this.bookingModel.find({
                payment_status: 'paid',
                feedback_status: 'inProgress',
                is_reminder: false,
                date: { $lte: startDate.toDate() }
            }).populate('user', 'name email').populate('vendor', 'name email role').populate('tour', 'name');
            await this.bookingModel.updateMany({
                payment_status: 'paid',
                feedback_status: 'inProgress',
                is_reminder: false,
                date: { $lte: startDate.toDate() }
            }, { $set: { is_reminder: true } });
            if (toUpdateBookings) {
                await this.emailService.vendorFeedbackTour(toUpdateBookings, `Tour Feedback`);
                await this.emailService.userFeedbackTour(toUpdateBookings, 'Tour Feedback');
            }
            console.log('feedback mail sent using cron');
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async addBadge() {
        try {
            const startDate = moment().startOf('day');
            let topVendorBooking = await this.bookingModel.aggregate([
                { $match: { payment_status: 'paid', date: { $lte: startDate.toDate() } } },
                {
                    $group: {
                        _id: "$vendor",
                        total: { $sum: 1 }
                    }
                },
                {
                    $sort: { total: -1 }
                },
                {
                    $limit: 1
                }
            ]);
            const vendor_id = topVendorBooking[0]._id;
            await this.userModel.updateMany({}, { badge: false });
            await this.userModel.findOneAndUpdate({ _id: vendor_id }, { badge: true });
            console.log('badge updated successfully using cron');
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async upCommingVendorTourReminder() {
        try {
            const startDate = moment().add(1, 'day').startOf('day');
            const endDate = moment().add(1, 'day').endOf('day');
            const upcomingBookings = await this.bookingModel.find({ payment_status: 'paid', date: { $gte: startDate.toDate(), $lte: endDate.toDate() } }).populate('user', 'name email').populate('tour').populate('vendor', 'name email');
            for (const upcommingBooking of upcomingBookings) {
                await this.emailService.upCommingVendorTourReminder(upcommingBooking, `Up-Comming Tour Reminder`);
            }
            console.log('upcomming vendor tours reminder sent using cron');
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async upCommingUserTourReminder() {
        try {
            const startDate = moment().add(1, 'day').startOf('day');
            const endDate = moment().add(1, 'day').endOf('day');
            const upcomingBookings = await this.bookingModel.find({ payment_status: 'paid', date: { $gte: startDate.toDate(), $lte: endDate.toDate() } }).populate('user', 'name email').populate('tour').populate('vendor', 'name email');
            if (upcomingBookings) {
                for (const upcommingBooking of upcomingBookings) {
                    await this.emailService.upCommingUserTourReminder(upcommingBooking, `Up-Comming Tour Reminder`);
                }
            }
            console.log('upcomming user tours reminder sent using cron');
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
__decorate([
    (0, schedule_1.Cron)('0 0-23/12 * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CronService.prototype, "vendorFeedBack", null);
__decorate([
    (0, schedule_1.Cron)('0 0 1 * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CronService.prototype, "addBadge", null);
__decorate([
    (0, schedule_1.Cron)('0 0 * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CronService.prototype, "upCommingVendorTourReminder", null);
__decorate([
    (0, schedule_1.Cron)('0 0 * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CronService.prototype, "upCommingUserTourReminder", null);
CronService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Booking')),
    __param(1, (0, mongoose_1.InjectModel)('User')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        Email_service_1.EmailService])
], CronService);
exports.CronService = CronService;
//# sourceMappingURL=cron.service.js.map