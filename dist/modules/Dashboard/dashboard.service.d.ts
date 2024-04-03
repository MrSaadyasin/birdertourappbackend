import { Model } from 'mongoose';
import { User } from 'src/model/user.model';
import { Booking } from 'src/model/booking.model';
import { Tour } from 'src/model/tour.model';
import { Stripe } from 'stripe';
export declare class DashboardService {
    private readonly tourModel;
    private readonly userModel;
    private readonly bookingModel;
    private readonly stripeClient;
    constructor(tourModel: Model<Tour>, userModel: Model<User>, bookingModel: Model<Booking>, stripeClient: Stripe);
    dashboardStats(): Promise<{
        totalUsers: number;
        totalVendors: number;
        totalTours: number;
        totalBookings: number;
        availableBalance: number;
    }>;
    getAllMailGroup(body: any): Promise<any[]>;
}
