import { Module } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { DateTimeFormatter } from 'src/Utils/DateTimeFormatter.service'
import { StripeModule } from '../stripe/stripe.module'
import { DatabaseModule } from 'src/common/database/database.module';
import { NotificationService } from '../notification/notification.service';
import { EmailService } from 'src/Utils/Email.service';


@Module({
    imports: [
        DatabaseModule,
        StripeModule,
        
    ],

    controllers: [BookingController],
    providers: [BookingService,EmailService, DateTimeFormatter,NotificationService],
    exports: [],
})
export class BookingModule {
    constructor() {
    }
}
