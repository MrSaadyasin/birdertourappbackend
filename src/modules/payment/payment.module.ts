import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { StripeModule } from '../stripe/stripe.module';
import { DatabaseModule } from 'src/common/database/database.module';
import { EmailService } from 'src/Utils/Email.service';
import { NotificationService } from '../notification/notification.service';



@Module({
    imports: [
        DatabaseModule,
        StripeModule
  
    ],

    controllers: [PaymentController],
    providers: [PaymentService, EmailService, NotificationService],
    exports: [],
})
export class PaymentModule {
    constructor() {
    }
}
