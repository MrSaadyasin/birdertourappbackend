import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { TourModule } from './modules/tour/tour.module';
import { FeedBackModule } from './modules/feedback/feedback.module';
import { AdminTourModule } from './modules/admin/tour/admin-tour.module';
import { AdminVendorModule } from './modules/admin/vendor/admin-vendor.module';
import { BookingModule } from './modules/booking/booking.module';
import { PaymentModule } from './modules/payment/payment.module';
import { WishListModule } from './modules/wishlist/wishlist.modue';
import { ScheduleModule } from '@nestjs/schedule';
import { CronModule } from './modules/cronJob/cron.module';
import { DashboardModule } from './modules/Dashboard/dashboard.module';
import { DatabaseModule } from './common/database/database.module';
import { NotificationModule } from './modules/notification/notification.module';
import { ChatModule } from './modules/chat/chat.module';
import { BlogModule } from './modules/admin/blog/blog.module';
import { TermsConditionModule } from './modules/termsCondition/termsCondition.module';





@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    MongooseModule.forRootAsync({ useFactory: () => ({ uri: process.env.MONGO_URI + process.env.DATABASE_NAME }), }),
    AuthModule,
    TourModule,
    AdminTourModule,
    AdminVendorModule,
    FeedBackModule,
    BookingModule,
    PaymentModule,
    WishListModule,
    CronModule,
    DashboardModule,
    DatabaseModule,
    NotificationModule,
    ChatModule,
    BlogModule,
    TermsConditionModule
  
  ],

  controllers: [],
  providers: [],
  exports: [],
})
export class RootModule {
  constructor() {
  }
}
