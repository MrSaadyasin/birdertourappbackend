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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RootModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const config_1 = require("@nestjs/config");
const auth_module_1 = require("./modules/auth/auth.module");
const tour_module_1 = require("./modules/tour/tour.module");
const feedback_module_1 = require("./modules/feedback/feedback.module");
const admin_tour_module_1 = require("./modules/admin/tour/admin-tour.module");
const admin_vendor_module_1 = require("./modules/admin/vendor/admin-vendor.module");
const booking_module_1 = require("./modules/booking/booking.module");
const payment_module_1 = require("./modules/payment/payment.module");
const wishlist_modue_1 = require("./modules/wishlist/wishlist.modue");
const schedule_1 = require("@nestjs/schedule");
const cron_module_1 = require("./modules/cronJob/cron.module");
const dashboard_module_1 = require("./modules/Dashboard/dashboard.module");
const database_module_1 = require("./common/database/database.module");
const notification_module_1 = require("./modules/notification/notification.module");
const chat_module_1 = require("./modules/chat/chat.module");
const blog_module_1 = require("./modules/admin/blog/blog.module");
const termsCondition_module_1 = require("./modules/termsCondition/termsCondition.module");
let RootModule = class RootModule {
    constructor() {
    }
};
RootModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot(),
            schedule_1.ScheduleModule.forRoot(),
            mongoose_1.MongooseModule.forRootAsync({ useFactory: () => ({ uri: process.env.MONGO_URI + process.env.DATABASE_NAME }), }),
            auth_module_1.AuthModule,
            tour_module_1.TourModule,
            admin_tour_module_1.AdminTourModule,
            admin_vendor_module_1.AdminVendorModule,
            feedback_module_1.FeedBackModule,
            booking_module_1.BookingModule,
            payment_module_1.PaymentModule,
            wishlist_modue_1.WishListModule,
            cron_module_1.CronModule,
            dashboard_module_1.DashboardModule,
            database_module_1.DatabaseModule,
            notification_module_1.NotificationModule,
            chat_module_1.ChatModule,
            blog_module_1.BlogModule,
            termsCondition_module_1.TermsConditionModule
        ],
        controllers: [],
        providers: [],
        exports: [],
    }),
    __metadata("design:paramtypes", [])
], RootModule);
exports.RootModule = RootModule;
//# sourceMappingURL=root.module.js.map