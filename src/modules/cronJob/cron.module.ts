import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { DatabaseModule } from 'src/common/database/database.module';
import { EmailService } from 'src/Utils/Email.service';


@Module({
    imports: [
        DatabaseModule,
    ],

    controllers: [],
    providers: [CronService,EmailService],
    exports: [],
})
export class CronModule {
    constructor() {
    }
}
