import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { DatabaseModule } from 'src/common/database/database.module';
import { NotificationService } from '../notification/notification.service';

@Module({
    imports: [
        DatabaseModule,
    ],

    controllers: [ChatController],
    providers: [ChatService, NotificationService],
    exports: [],
})
export class ChatModule { }

