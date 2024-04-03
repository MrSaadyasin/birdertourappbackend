import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { StripeModule } from '../stripe/stripe.module'
import { DatabaseModule } from 'src/common/database/database.module';



@Module({
    imports: [
        DatabaseModule,
        StripeModule
    ],

    controllers: [DashboardController],
    providers: [DashboardService],
    exports: [],
})
export class DashboardModule {
    constructor() {
    }
}
