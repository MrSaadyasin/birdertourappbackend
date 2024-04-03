import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/common/database/database.module';
import { EmailService } from 'src/Utils/Email.service';
import { TermsConditionController } from './termsCondition.controller';
import { TermsConditionService } from './termsCondition.service';




@Module({
    imports: [
        DatabaseModule,
  
    ],

    controllers: [TermsConditionController],
    providers: [TermsConditionService, EmailService],
    exports: [],
})
export class TermsConditionModule {
    constructor() {
    }
}
