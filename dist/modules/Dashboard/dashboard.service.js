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
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const mongoose_2 = require("@nestjs/mongoose");
const stripe_1 = require("stripe");
let DashboardService = class DashboardService {
    constructor(tourModel, userModel, bookingModel, stripeClient) {
        this.tourModel = tourModel;
        this.userModel = userModel;
        this.bookingModel = bookingModel;
        this.stripeClient = stripeClient;
    }
    async dashboardStats() {
        const totalUsers = await this.userModel.countDocuments({ role: 'user' });
        const totalVendors = await this.userModel.countDocuments({ role: 'vendor', status: 'approved' });
        const totalTours = await this.tourModel.countDocuments({ status: 'approved' });
        const totalBookings = await this.bookingModel.countDocuments({ payment_status: 'paid' });
        const balance = await this.stripeClient.balance.retrieve();
        const usdBalance = balance.available.find((balanceObj) => balanceObj.currency === 'usd');
        const availableBalanceInUSD = usdBalance ? usdBalance.amount / 100 : 0;
        return {
            totalUsers: totalUsers,
            totalVendors: totalVendors,
            totalTours: totalTours,
            totalBookings: totalBookings,
            availableBalance: availableBalanceInUSD
        };
    }
    async getAllMailGroup(body) {
        try {
            const { type } = body;
            let emails = [];
            if (type === 'user') {
                const users = await this.userModel.find({ role: 'user' }).select('email');
                emails = users.map(user => user.email);
            }
            else if (type === 'vendor') {
                const vendors = await this.userModel.find({ role: 'vendor', status: 'approved' });
                emails = vendors.map(user => user.email);
            }
            return emails;
        }
        catch (error) {
        }
    }
};
DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)('Tour')),
    __param(1, (0, mongoose_2.InjectModel)('User')),
    __param(2, (0, mongoose_2.InjectModel)('Booking')),
    __param(3, (0, common_1.Inject)('STRIPE')),
    __metadata("design:paramtypes", [mongoose_1.Model,
        mongoose_1.Model,
        mongoose_1.Model,
        stripe_1.Stripe])
], DashboardService);
exports.DashboardService = DashboardService;
//# sourceMappingURL=dashboard.service.js.map