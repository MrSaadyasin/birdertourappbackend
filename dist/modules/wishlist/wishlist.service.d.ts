/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
import { Model } from 'mongoose';
import { WishListDTO } from 'src/dto/wishlist.dto';
import { WishList } from 'src/model/wishlist.model';
import { Pricing } from 'src/model/pricing.model';
export declare class WishListService {
    private readonly wishlistModel;
    private readonly pricingModel;
    constructor(wishlistModel: Model<WishList>, pricingModel: Model<Pricing>);
    getAll(req: any): Promise<any>;
    tour(req: WishListDTO, request: any): Promise<import("mongoose").Document<unknown, {}, WishList> & Omit<WishList & {
        _id: import("mongoose").Types.ObjectId;
    }, never>>;
    getAllTours(tours: any): Promise<any>;
}
