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
exports.AdminTourService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const mongoose_2 = require("@nestjs/mongoose");
const class_validator_1 = require("class-validator");
const notification_service_1 = require("../../notification/notification.service");
let AdminTourService = class AdminTourService {
    constructor(tourModel, pricingModel, bookingModel, searchKeywordModel, notificationService) {
        this.tourModel = tourModel;
        this.pricingModel = pricingModel;
        this.bookingModel = bookingModel;
        this.searchKeywordModel = searchKeywordModel;
        this.notificationService = notificationService;
    }
    async getPendingTours() {
        try {
            const tours = await this.tourModel.find({ status: 'pending' }).populate('vendor', 'name email role profile_image badge').sort({ createdAt: -1 });
            return this.getAllTours(tours);
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getEditedTours() {
        try {
            const tours = await this.tourModel.find({ status: 'edited' }).populate('vendor', 'name email role profile_image badge').sort({ createdAt: -1 });
            return this.getAllTours(tours);
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getApprovedTours() {
        try {
            const tours = await this.tourModel.find({ status: 'approved' }).populate('vendor', 'name email role profile_image badge').sort({ createdAt: -1 });
            ;
            return this.getAllTours(tours);
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getRejectedTours() {
        try {
            const tours = await this.tourModel.find({ status: 'rejected' }).populate('vendor', 'name email role profile_image badge').sort({ createdAt: -1 });
            return this.getAllTours(tours);
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getAllTours(tours) {
        try {
            const tourIds = tours.map(tour => tour._id);
            const pricings = await this.pricingModel.find({ tour: { $in: tourIds } });
            const mergedData = tours.map(tour => {
                const pricing = pricings.find(pricing => pricing.tour.toString() === tour._id.toString());
                return Object.assign(Object.assign({}, tour['_doc']), { pricing: pricing ? pricing : null });
            });
            return mergedData;
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
            const tour = await this.tourModel.findOneAndUpdate({ _id: id }, { status: status, message: message }, { new: true, runValidators: true });
            let vendor_id = tour.vendor.toString();
            await this.notificationService.sendNotification('Tour Status Update', `${tour.name} tour is ${status} by admin`, undefined, vendor_id, "vendor");
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async searchKeywords() {
        const allKeywords = await this.searchKeywordModel.find().lean();
        const parsedKeywords = allKeywords.map(entry => (Object.assign(Object.assign({}, entry), { country_location: JSON.parse(entry.country_location) })));
        const aggregatedResults = parsedKeywords.reduce((acc, curr) => {
            const country = curr.country_location.country;
            const keyword = curr.keyword;
            const countryKeywordCombo = `${country}-${keyword}`;
            if (!acc[countryKeywordCombo]) {
                acc[countryKeywordCombo] =
                    {
                        country: country,
                        keyword: keyword,
                        count: 0
                    };
            }
            acc[countryKeywordCombo].count += 1;
            return acc;
        }, {});
        const finalResult = Object.values(aggregatedResults).map((entry) => ({
            country: entry.country,
            count: entry.count,
            keywords: entry.keyword
        }));
        return finalResult;
    }
    async getTopSearchKeywords() {
        const allKeywords = await this.searchKeywordModel.find().lean();
        const parsedKeywords = allKeywords.map(entry => (Object.assign(Object.assign({}, entry), { country_location: JSON.parse(entry.country_location) })));
        const keywordSearchCounts = parsedKeywords.reduce((acc, curr) => {
            const keyword = curr.keyword;
            if (!acc[keyword]) {
                acc[keyword] = 0;
            }
            acc[keyword] += 1;
            return acc;
        }, {});
        const topSearchKeywords = Object.keys(keywordSearchCounts)
            .map(keyword => ({
            keyword: keyword,
            totalSearches: keywordSearchCounts[keyword]
        }))
            .sort((a, b) => b.totalSearches - a.totalSearches)
            .slice(0, 6);
        return topSearchKeywords;
    }
};
AdminTourService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)('Tour')),
    __param(1, (0, mongoose_2.InjectModel)('Pricing')),
    __param(2, (0, mongoose_2.InjectModel)('Booking')),
    __param(3, (0, mongoose_2.InjectModel)('SearchKeyword')),
    __metadata("design:paramtypes", [mongoose_1.Model,
        mongoose_1.Model,
        mongoose_1.Model,
        mongoose_1.Model,
        notification_service_1.NotificationService])
], AdminTourService);
exports.AdminTourService = AdminTourService;
//# sourceMappingURL=admin-tour.service.js.map