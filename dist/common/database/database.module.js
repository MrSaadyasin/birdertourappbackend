"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const feedback_schema_1 = require("../../schema/feedback.schema");
const user_schema_1 = require("../../schema/user.schema");
const booking_schema_1 = require("../../schema/booking.schema");
const tour_schema_1 = require("../../schema/tour.schema");
const notification_schema_1 = require("../../schema/notification.schema");
const token_schema_1 = require("../../schema/token.schema");
const payment_schema_1 = require("../../schema/payment.schema");
const pricing_schema_1 = require("../../schema/pricing.schema");
const wishlist_schema_1 = require("../../schema/wishlist.schema");
const chat_schema_1 = require("../../schema/chat.schema");
const vendorPayment_schema_1 = require("../../schema/vendorPayment.schema");
const blog_schema_1 = require("../../schema/blog.schema");
const searchKeywords_schema_1 = require("../../schema/searchKeywords.schema");
const termsCondition_schema_1 = require("../../schema/termsCondition.schema");
let DatabaseModule = class DatabaseModule {
};
DatabaseModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                {
                    name: 'Feedback',
                    schema: feedback_schema_1.feedBackSchema,
                    collection: 'feedbacks',
                },
                {
                    name: 'User',
                    schema: user_schema_1.userSchema,
                    collection: 'users',
                },
                {
                    name: 'Payment',
                    schema: payment_schema_1.paymentSchema,
                    collection: 'payments'
                },
                {
                    name: 'Token',
                    schema: token_schema_1.tokenSchema,
                    collection: 'token'
                },
                {
                    name: 'Booking',
                    schema: booking_schema_1.bookingSchema,
                    collection: 'bookings',
                },
                {
                    name: 'Tour',
                    schema: tour_schema_1.tourSchema,
                    collection: 'tours',
                },
                {
                    name: 'Notification',
                    schema: notification_schema_1.notificationSchema,
                    collection: 'notifications',
                },
                {
                    name: 'Pricing',
                    schema: pricing_schema_1.pricingSchema,
                    collection: 'pricing'
                },
                {
                    name: 'Wishlist',
                    schema: wishlist_schema_1.wishlistSchema,
                    collection: 'wishlists'
                },
                {
                    name: 'Chat',
                    schema: chat_schema_1.chatSchema,
                    collection: 'chat'
                },
                {
                    name: 'VendorPayment',
                    schema: vendorPayment_schema_1.vendorPaymentSchema,
                    collection: 'vendorpayments'
                },
                {
                    name: 'Blog',
                    schema: blog_schema_1.blogSchema,
                    collection: 'blogs'
                },
                {
                    name: 'SearchKeyword',
                    schema: searchKeywords_schema_1.searchKeywordSchema,
                    collection: 'searchkeywords'
                },
                {
                    name: 'TermsCondition',
                    schema: termsCondition_schema_1.TermsConditionSchema,
                    collection: 'termscondition'
                }
            ]),
        ],
        controllers: [],
        providers: [],
        exports: [mongoose_1.MongooseModule],
    })
], DatabaseModule);
exports.DatabaseModule = DatabaseModule;
//# sourceMappingURL=database.module.js.map