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
exports.TermsConditionService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const mongoose_2 = require("@nestjs/mongoose");
const Email_service_1 = require("../../Utils/Email.service");
let TermsConditionService = class TermsConditionService {
    constructor(termsConditionModel, userModel, emailService) {
        this.termsConditionModel = termsConditionModel;
        this.userModel = userModel;
        this.emailService = emailService;
    }
    async get() {
        try {
            return await this.termsConditionModel.find();
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async createOrUpdate(termsConditionDto) {
        try {
            const { terms_condition } = termsConditionDto;
            const options = { upsert: true, new: true, setDefaultsOnInsert: true };
            await this.termsConditionModel.findOneAndUpdate({}, { terms_condition }, options);
            const usersAndVendors = await this.userModel.find({ role: { $ne: 'admin' } });
            const link = `${process.env.APP_URL}terms-and-condition`;
            const emailPromises = usersAndVendors.map(user => {
                return this.emailService.updateTermsCondition(user.email, user === null || user === void 0 ? void 0 : user.name, link, `New Terms & Condition`)
                    .then(() => console.log(`Email sent to ${user.email}`))
                    .catch(error => console.error(`Failed to send email to ${user.email}:`, error));
            });
            await Promise.all(emailPromises);
            return;
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async topVendors() {
        try {
            const topVendors = await this.userModel.aggregate([
                {
                    $match: {
                        role: 'vendor',
                        rating: { $ne: 0 }
                    }
                },
                {
                    $sort: { rating: -1 }
                },
                {
                    $lookup: {
                        from: "tours",
                        let: { vendorId: "$_id" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ["$vendor", "$$vendorId"] },
                                            { $eq: ["$status", "approved"] }
                                        ]
                                    }
                                }
                            }
                        ],
                        as: "approvedTours"
                    }
                },
                {
                    $addFields: {
                        total_tours: { $size: "$approvedTours" }
                    }
                },
                {
                    $project: {
                        approvedTours: 0
                    }
                }
            ]).limit(10);
            return topVendors;
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
TermsConditionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)('TermsCondition')),
    __param(1, (0, mongoose_2.InjectModel)('User')),
    __metadata("design:paramtypes", [mongoose_1.Model,
        mongoose_1.Model,
        Email_service_1.EmailService])
], TermsConditionService);
exports.TermsConditionService = TermsConditionService;
//# sourceMappingURL=termsCondition.service.js.map