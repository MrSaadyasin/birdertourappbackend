import { Module } from '@nestjs/common';
import { AdminTourController } from './admin-tour.controller';
import { AdminTourService } from './admin-tour.service';
import { DatabaseModule } from 'src/common/database/database.module';
import { NotificationService } from 'src/modules/notification/notification.service';


@Module({
    imports: [
        DatabaseModule,
    ],

    controllers: [AdminTourController],
    providers: [AdminTourService, NotificationService],
    exports: [],
})
export class AdminTourModule {
    constructor() {
        console.log('Admin Tour Module');
    }
}
