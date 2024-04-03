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
exports.WishListService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const mongoose_2 = require("@nestjs/mongoose");
let WishListService = class WishListService {
    constructor(wishlistModel, pricingModel) {
        this.wishlistModel = wishlistModel;
        this.pricingModel = pricingModel;
    }
    async getAll(req) {
        try {
            const user_id = req['user'].id;
            const wishlist = await this.wishlistModel.find({ user: user_id }).populate({
                path: 'tour',
                populate: {
                    path: 'vendor',
                    select: 'name'
                }
            });
            const tourPricing = await this.getAllTours(wishlist);
            return tourPricing;
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async tour(req, request) {
        try {
            const { tour_id } = req;
            const user_id = request['user'].id;
            const wishlist = await this.wishlistModel.findOne({ user: user_id, tour: tour_id });
            if (wishlist) {
                await this.wishlistModel.findOneAndDelete({ user: user_id, tour: tour_id });
            }
            else {
                const wishlist = {
                    user: user_id,
                    tour: tour_id,
                };
                return new this.wishlistModel(wishlist).save();
            }
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getAllTours(tours) {
        try {
            const tourIds = tours.map(tour => tour.tour._id);
            const pricings = await this.pricingModel.find({ tour: { $in: tourIds } });
            const mergedData = tours.map(tour => {
                const pricing = pricings.find(pricing => pricing.tour.toString() === tour.tour._id.toString());
                return {
                    tour: Object.assign(Object.assign({}, tour['_doc']), { pricing: pricing ? pricing : null }),
                };
            });
            return mergedData;
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
WishListService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)('Wishlist')),
    __param(1, (0, mongoose_2.InjectModel)('Pricing')),
    __metadata("design:paramtypes", [mongoose_1.Model,
        mongoose_1.Model])
], WishListService);
exports.WishListService = WishListService;
//# sourceMappingURL=wishlist.service.js.map