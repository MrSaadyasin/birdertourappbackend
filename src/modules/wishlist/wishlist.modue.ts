import { Module } from '@nestjs/common';
import {WishListController} from './wishlist.controller'
import { WishListService } from './wishlist.service';
import { DatabaseModule } from 'src/common/database/database.module';
@Module({
    imports: [
        DatabaseModule,
    ],

    controllers: [WishListController],
    providers: [WishListService],
    exports: [],
})
export class WishListModule {
    constructor() {
    }
}
