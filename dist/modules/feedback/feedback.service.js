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
exports.FeedBackService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const mongoose_2 = require("@nestjs/mongoose");
const moment = require("moment");
let FeedBackService = class FeedBackService {
    constructor(feedBackModel, userModel, bookingModel) {
        this.feedBackModel = feedBackModel;
        this.userModel = userModel;
        this.bookingModel = bookingModel;
    }
    async getAll() {
        try {
            return await this.feedBackModel.find().populate('user', 'name email role').populate('tour', 'name');
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async pendingFeedBack(request) {
        try {
            const startDate = moment().startOf('day');
            const user_id = request['user'].id;
            return await this.bookingModel.find({ user: user_id, payment_status: 'paid', feedback_status: 'pending', date: { $lte: startDate.toDate() } }).populate('tour');
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async add(req) {
        try {
            let { vendor_id, user_id, booking_id, tour_id, comment, rating, status } = req;
            if (status === 'cancel') {
                return await this.bookingModel.findOneAndUpdate({ _id: booking_id }, { $set: { feedback_status: status } });
            }
            let type = '';
            const user = vendor_id ? await this.userModel.findOne({ _id: vendor_id }).select('role name email') : await this.userModel.findOne({ _id: user_id }).select('role email name');
            const booking = await this.bookingModel.findOne({ _id: booking_id }).populate('user', 'name email role').populate('vendor', 'name email role');
            const sendby = vendor_id ? booking.user._id : booking.vendor._id;
            if (vendor_id) {
                type = 'user';
            }
            else {
                type = 'vendor';
            }
            const updateObject = {
                user: user_id || booking.user._id,
                vendor: vendor_id || booking.vendor._id,
                tour: booking.tour._id,
                rating: Number(rating),
                type: type,
                comment: comment
            };
            type === 'user' ? await this.feedBackModel.findOneAndUpdate({ user: user_id || booking.user._id, tour: booking.tour._id, type: 'user' }, updateObject, { new: true, upsert: true }) :
                await this.feedBackModel.findOneAndUpdate({ type: 'vendor', vendor: vendor_id || booking.vendor._id, user: user_id }, updateObject, { new: true, upsert: true });
            let match = type === 'user' ?
                {
                    user: new mongoose_1.default.Types.ObjectId(user_id || booking.user._id),
                    type: 'user'
                } :
                {
                    vendor: new mongoose_1.default.Types.ObjectId(vendor_id || booking.vendor._id),
                    type: 'vendor'
                };
            const feedback = await this.feedBackModel.aggregate([
                {
                    $match: match
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: '$rating' }
                    }
                }
            ]);
            if (type == 'user') {
                const vendorLength = await this.feedBackModel.countDocuments({ vendor: vendor_id, type: 'user' });
                let calculatedRating = feedback.length > 0 ? (feedback[0].total / vendorLength) : 0;
                const v = await this.userModel.findOneAndUpdate({ _id: vendor_id }, { $set: { rating: calculatedRating } }, { new: true });
                await this.bookingModel.findOneAndUpdate({ _id: booking_id }, { $set: { feedback_status: status } });
            }
            else {
                const userLength = await this.feedBackModel.countDocuments({ user: user_id, type: 'vendor' });
                let calculatedRating = feedback.length > 0 ? (feedback[0].total / userLength) : 0;
                await this.userModel.findOneAndUpdate({ _id: user_id }, { $set: { rating: calculatedRating } });
            }
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
FeedBackService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)('Feedback')),
    __param(1, (0, mongoose_2.InjectModel)('User')),
    __param(2, (0, mongoose_2.InjectModel)('Booking')),
    __metadata("design:paramtypes", [mongoose_1.Model,
        mongoose_1.Model,
        mongoose_1.Model])
], FeedBackService);
exports.FeedBackService = FeedBackService;
//# sourceMappingURL=feedback.service.js.map