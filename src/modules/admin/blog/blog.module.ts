import { Module } from '@nestjs/common';
import { BlogController } from './blog.controller'
import { BlogService } from './blog.service';
import { DatabaseModule } from 'src/common/database/database.module';
import { FileUploadService } from 'src/Utils/UploadFile.service';


@Module({
    imports: [
        DatabaseModule,
    ],

    controllers: [BlogController],
    providers: [BlogService,FileUploadService],
    exports: [],
})
export class BlogModule {
    constructor() {
    }
}
