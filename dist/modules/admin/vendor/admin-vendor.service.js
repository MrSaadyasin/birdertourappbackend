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
exports.AdminVendorService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const mongoose_2 = require("@nestjs/mongoose");
const class_validator_1 = require("class-validator");
const notification_service_1 = require("../../notification/notification.service");
let AdminVendorService = class AdminVendorService {
    constructor(userModel, feedBackModel, pricingModel, notificationService) {
        this.userModel = userModel;
        this.feedBackModel = feedBackModel;
        this.pricingModel = pricingModel;
        this.notificationService = notificationService;
    }
    async getPendingVendors() {
        try {
            const vendors = await this.userModel.find({ status: 'pending', role: 'vendor' });
            return vendors;
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getApprovedVendors() {
        try {
            const vendors = await this.userModel.find({ status: 'approved', role: 'vendor' });
            return vendors;
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getRejectedVendors() {
        try {
            const vendors = await this.userModel.find({ status: 'rejected', role: 'vendor' });
            return vendors;
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getAllUserList() {
        try {
            return await this.userModel.find({ role: 'user' }).select('name email profile_image address');
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getVendorDetail(vendor_id) {
        try {
            const vendor = await this.userModel.findOne({ _id: vendor_id, role: 'vendor' });
            let tourWithPricing = await this.pricingModel.find({ vendor: vendor_id }).populate('tour');
            let feedbacks = [];
            for (const tour of tourWithPricing) {
                let feedback = await this.feedBackModel.find({ tour: tour.tour._id }).populate('user', 'name profile_image');
                if (feedback !== null) {
                    feedbacks = feedbacks.concat(feedback);
                }
            }
            const vendorDetail = {
                profile: vendor,
                tours: tourWithPricing,
                feedbacks: feedbacks
            };
            return vendorDetail;
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async updateStatus(req) {
        try {
            const { id, status, message } = req;
            if (status === 'rejected' && (0, class_validator_1.isEmpty)(message)) {
                throw new common_1.HttpException('Rejected reason is required', common_1.HttpStatus.BAD_REQUEST);
            }
            const vendor = await this.userModel.findOneAndUpdate({ _id: id }, { status: status, message: message }, { new: true, runValidators: true });
            await this.notificationService.sendNotification('Profile Status Update', `You are ${status} by admin`, undefined, vendor._id, "vendor");
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async addBadge(req) {
        try {
            const { vendor_id, badge } = req;
            const vendor = await this.userModel.findOneAndUpdate({ _id: vendor_id, role: 'vendor', status: 'approved' }, { badge: badge }, { new: true });
            if (badge === 'true') {
                await this.notificationService.sendNotification('Got Badge', `Congratulation you got badge by admin`, undefined, vendor_id, "vendor");
            }
            else if (badge === 'false') {
                await this.notificationService.sendNotification('Removed Badge', 'Badge removed by admin', undefined, vendor_id, "vendor");
            }
            return vendor;
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
AdminVendorService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)('User')),
    __param(1, (0, mongoose_2.InjectModel)('Feedback')),
    __param(2, (0, mongoose_2.InjectModel)('Pricing')),
    __metadata("design:paramtypes", [mongoose_1.Model,
        mongoose_1.Model,
        mongoose_1.Model,
        notification_service_1.NotificationService])
], AdminVendorService);
exports.AdminVendorService = AdminVendorService;
//# sourceMappingURL=admin-vendor.service.js.map