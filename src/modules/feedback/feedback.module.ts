import { Module } from '@nestjs/common';
import { FeedBackController } from './feedback.controller';
import { FeedBackService } from './feedback.service';
import { DatabaseModule } from 'src/common/database/database.module';




@Module({
    imports: [
        DatabaseModule,
    ],

    controllers: [FeedBackController],
    providers: [FeedBackService],
    exports: [],
})
export class FeedBackModule {
    constructor() {
    }
}
