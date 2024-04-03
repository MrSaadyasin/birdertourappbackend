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
import { Tour } from 'src/model/tour.model';
import { Pricing } from 'src/model/pricing.model';
import { FeedBack } from 'src/model/feedback.model';
import { TourDTO } from 'src/dto/tour.dto';
import { FileUploadService } from 'src/Utils/UploadFile.service';
import { Request } from 'express';
import { User } from 'src/model/user.model';
import { Booking } from 'src/model/booking.model';
import { SearchKeyword } from 'src/model/searchKeywords.model';
import { DateTimeFormatter } from 'src/Utils/DateTimeFormatter.service';
import { TourSearchDTO } from 'src/dto/tour-search.dto';
import { NotificationService } from '../notification/notification.service';
export declare class TourService {
    private readonly tourModel;
    private readonly pricingModel;
    private readonly feedBackModel;
    private readonly userModel;
    private readonly bookingModel;
    private readonly searchKeywordModel;
    private fileUpload;
    private notificationService;
    private dateTimeFormatter;
    constructor(tourModel: Model<Tour>, pricingModel: Model<Pricing>, feedBackModel: Model<FeedBack>, userModel: Model<User>, bookingModel: Model<Booking>, searchKeywordModel: Model<SearchKeyword>, fileUpload: FileUploadService, notificationService: NotificationService, dateTimeFormatter: DateTimeFormatter);
    getAll(): Promise<any>;
    upComingsTours(): Promise<any>;
    searchTour(body: TourSearchDTO, request: Request): Promise<any>;
    searchKeyword(keyword: string, request: Request): Promise<import("mongoose").Document<unknown, {}, SearchKeyword> & Omit<SearchKeyword & {
        _id: import("mongoose").Types.ObjectId;
    }, never>>;
    create(req: TourDTO, request: Request): Promise<import("mongoose").Document<unknown, {}, Tour> & Omit<Tour & {
        _id: import("mongoose").Types.ObjectId;
    }, never>>;
    createTourPricing(tour: Object, req: TourDTO): Promise<import("mongoose").Document<unknown, {}, Pricing> & Omit<Pricing & {
        _id: import("mongoose").Types.ObjectId;
    }, never>>;
    updateTourPricing(tour: Object, body: TourDTO): Promise<import("mongoose").Document<unknown, {}, Pricing> & Omit<Pricing & {
        _id: import("mongoose").Types.ObjectId;
    }, never>>;
    getPendingTours(req: any): Promise<any>;
    getApprovedTours(req: any): Promise<any>;
    getEditedTours(req: any): Promise<any>;
    getRejectedTours(req: any): Promise<any>;
    updateTour(id: string, body: TourDTO, request: any): Promise<import("mongoose").Document<unknown, {}, Tour> & Omit<Tour & {
        _id: import("mongoose").Types.ObjectId;
    }, never>>;
    getTourDetail(req: any, tour_id: string): Promise<{
        pricing: import("mongoose").Document<unknown, {}, Pricing> & Omit<Pricing & {
            _id: import("mongoose").Types.ObjectId;
        }, never>;
        feedbacks: (import("mongoose").Document<unknown, {}, FeedBack> & Omit<FeedBack & {
            _id: import("mongoose").Types.ObjectId;
        }, never>)[];
        vendor: import("mongoose").Types.ObjectId;
        name: string;
        video: string;
        caption_images: [];
        description: String;
        status: string;
        location: string;
        message: string;
        pricing_type: string;
        _id: any;
        __v?: any;
        $locals: Record<string, unknown>;
        $op: "save" | "validate" | "remove";
        $where: Record<string, unknown>;
        baseModelName?: string;
        collection: import("mongoose").Collection<import("bson").Document>;
        db: import("mongoose").Connection;
        errors?: import("mongoose").Error.ValidationError;
        id?: any;
        isNew: boolean;
        schema: import("mongoose").Schema<any, Model<any, any, any, any, any, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, {
            [x: string]: any;
        }, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
            [x: string]: any;
        }>> & Omit<import("mongoose").FlatRecord<{
            [x: string]: any;
        }> & Required<{
            _id: unknown;
        }>, never>>;
    }>;
    getAllBookings(tour_id: string): Promise<Omit<import("mongoose").Document<unknown, {}, Booking> & Omit<Booking & {
        _id: import("mongoose").Types.ObjectId;
    }, never>, never>[]>;
    getUserTourDetail(tour_id: string): Promise<{
        pricing: import("mongoose").Document<unknown, {}, Pricing> & Omit<Pricing & {
            _id: import("mongoose").Types.ObjectId;
        }, never>;
        feedbacks: Omit<import("mongoose").Document<unknown, {}, FeedBack> & Omit<FeedBack & {
            _id: import("mongoose").Types.ObjectId;
        }, never>, never>[];
        vendor: import("mongoose").Types.ObjectId;
        name: string;
        video: string;
        caption_images: [];
        description: String;
        status: string;
        location: string;
        message: string;
        pricing_type: string;
        _id: any;
        __v?: any;
        $locals: Record<string, unknown>;
        $op: "save" | "validate" | "remove";
        $where: Record<string, unknown>;
        baseModelName?: string;
        collection: import("mongoose").Collection<import("bson").Document>;
        db: import("mongoose").Connection;
        errors?: import("mongoose").Error.ValidationError;
        id?: any;
        isNew: boolean;
        schema: import("mongoose").Schema<any, Model<any, any, any, any, any, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, {
            [x: string]: any;
        }, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
            [x: string]: any;
        }>> & Omit<import("mongoose").FlatRecord<{
            [x: string]: any;
        }> & Required<{
            _id: unknown;
        }>, never>>;
    }>;
    topTours(): Promise<any[]>;
    getAllTours(tours: any): Promise<any>;
    compileBookedSlots(bookings: any): {
        full_day: any[];
        half_day: any[];
        hourly_bases: any[];
    };
}
