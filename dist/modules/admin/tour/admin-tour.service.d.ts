import { Model } from 'mongoose';
import { Tour } from '../../../model/tour.model';
import { Pricing } from '../../../model/pricing.model';
import { Booking } from 'src/model/booking.model';
import { NotificationService } from 'src/modules/notification/notification.service';
import { SearchKeyword } from 'src/model/searchKeywords.model';
export declare class AdminTourService {
    private readonly tourModel;
    private readonly pricingModel;
    private readonly bookingModel;
    private readonly searchKeywordModel;
    private notificationService;
    constructor(tourModel: Model<Tour>, pricingModel: Model<Pricing>, bookingModel: Model<Booking>, searchKeywordModel: Model<SearchKeyword>, notificationService: NotificationService);
    getPendingTours(): Promise<any>;
    getEditedTours(): Promise<any>;
    getApprovedTours(): Promise<any>;
    getRejectedTours(): Promise<any>;
    getAllTours(tours: any): Promise<any>;
    updateStatus(req: any): Promise<void>;
    searchKeywords(): Promise<{
        country: any;
        count: any;
        keywords: any;
    }[]>;
    getTopSearchKeywords(): Promise<{
        keyword: string;
        totalSearches: number;
    }[]>;
}
