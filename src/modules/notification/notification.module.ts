import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { DatabaseModule } from 'src/common/database/database.module';
import { NotificationController } from './notification.controller';
@Module({
    imports: [
        DatabaseModule,
    ],

    controllers: [NotificationController],
    providers: [NotificationService],
    exports: [],
})
export class NotificationModule { }

