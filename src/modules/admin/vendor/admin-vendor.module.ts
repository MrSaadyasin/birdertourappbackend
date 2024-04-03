import { Module } from '@nestjs/common';
import { AdminVendorController } from './admin-vendor.controller';
import { AdminVendorService } from './admin-vendor.service';
import { DatabaseModule } from 'src/common/database/database.module';
import { NotificationService } from 'src/modules/notification/notification.service';


@Module({
    imports: [
        DatabaseModule,
    ],

    controllers: [AdminVendorController],
    providers: [AdminVendorService,NotificationService],
    exports: [],
})
export class AdminVendorModule {
    constructor() {
        console.log('Admin Vendor Module');
    }
}
