import { Module } from '@nestjs/common';
import { TourController } from './tour.controller';
import { TourService } from './tour.service';
import { FileUploadService } from 'src/Utils/UploadFile.service';
import { DateTimeFormatter } from 'src/Utils/DateTimeFormatter.service';
import { DatabaseModule } from 'src/common/database/database.module';
import { NotificationService } from '../notification/notification.service';


@Module({
    imports: [
        DatabaseModule,
    ],

    controllers: [TourController],
    providers: [TourService, FileUploadService,DateTimeFormatter, NotificationService],
    exports: [],
})
export class TourModule {
    constructor() {
        console.log('Tour Module');
    }
}
