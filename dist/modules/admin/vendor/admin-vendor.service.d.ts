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
import { User } from '../../../model/user.model';
import { FeedBack } from 'src/model/feedback.model';
import { Pricing } from 'src/model/pricing.model';
import { NotificationService } from 'src/modules/notification/notification.service';
export declare class AdminVendorService {
    private readonly userModel;
    private readonly feedBackModel;
    private readonly pricingModel;
    private notificationService;
    constructor(userModel: Model<User>, feedBackModel: Model<FeedBack>, pricingModel: Model<Pricing>, notificationService: NotificationService);
    getPendingVendors(): Promise<(import("mongoose").Document<unknown, {}, User> & Omit<User & {
        _id: import("mongoose").Types.ObjectId;
    }, never>)[]>;
    getApprovedVendors(): Promise<(import("mongoose").Document<unknown, {}, User> & Omit<User & {
        _id: import("mongoose").Types.ObjectId;
    }, never>)[]>;
    getRejectedVendors(): Promise<(import("mongoose").Document<unknown, {}, User> & Omit<User & {
        _id: import("mongoose").Types.ObjectId;
    }, never>)[]>;
    getAllUserList(): Promise<(import("mongoose").Document<unknown, {}, User> & Omit<User & {
        _id: import("mongoose").Types.ObjectId;
    }, never>)[]>;
    getVendorDetail(vendor_id: string): Promise<{
        profile: import("mongoose").Document<unknown, {}, User> & Omit<User & {
            _id: import("mongoose").Types.ObjectId;
        }, never>;
        tours: Omit<import("mongoose").Document<unknown, {}, Pricing> & Omit<Pricing & {
            _id: import("mongoose").Types.ObjectId;
        }, never>, never>[];
        feedbacks: any[];
    }>;
    updateStatus(req: any): Promise<void>;
    addBadge(req: any): Promise<import("mongoose").Document<unknown, {}, User> & Omit<User & {
        _id: import("mongoose").Types.ObjectId;
    }, never>>;
}
