import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { feedBackSchema } from 'src/schema/feedback.schema';
import { userSchema } from 'src/schema/user.schema';
import { bookingSchema } from 'src/schema/booking.schema';
import { tourSchema } from 'src/schema/tour.schema';
import { notificationSchema } from 'src/schema/notification.schema';
import { tokenSchema } from 'src/schema/token.schema';
import { paymentSchema } from 'src/schema/payment.schema';
import { pricingSchema } from 'src/schema/pricing.schema';
import { wishlistSchema } from 'src/schema/wishlist.schema';
import { chatSchema } from 'src/schema/chat.schema';
import { vendorPaymentSchema } from 'src/schema/vendorPayment.schema';
import { blogSchema } from 'src/schema/blog.schema';
import { searchKeywordSchema } from 'src/schema/searchKeywords.schema';
import { TermsConditionSchema } from 'src/schema/termsCondition.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: 'Feedback',
                schema: feedBackSchema,
                collection: 'feedbacks',
            },
            {
                name: 'User',
                schema: userSchema,
                collection: 'users',
            },
            {
                name: 'Payment',
                schema: paymentSchema,
                collection: 'payments'
            },
            {
                name: 'Token',
                schema: tokenSchema,
                collection: 'token'
            },
            {
                name: 'Booking',
                schema: bookingSchema,
                collection: 'bookings',
            },
            {
                name: 'Tour',
                schema: tourSchema,
                collection: 'tours',
            },
            {
                name: 'Notification',
                schema: notificationSchema,
                collection: 'notifications',
            },
            {
                name: 'Pricing',
                schema: pricingSchema,
                collection: 'pricing'
            },
            {
                name: 'Wishlist',
                schema: wishlistSchema,
                collection: 'wishlists'
            },
            {
                name: 'Chat',
                schema: chatSchema,
                collection: 'chat'
            },
            {
                name: 'VendorPayment',
                schema: vendorPaymentSchema,
                collection: 'vendorpayments'
            },
            {
                name : 'Blog',
                schema: blogSchema,
                collection : 'blogs'
            },
            {
                name : 'SearchKeyword',
                schema: searchKeywordSchema,
                collection : 'searchkeywords'
            },
            {
                name : 'TermsCondition',
                schema: TermsConditionSchema,
                collection : 'termscondition'
            }
        ]),
    ],

    controllers: [],
    providers: [],
    exports: [MongooseModule],
})
export class DatabaseModule { }

