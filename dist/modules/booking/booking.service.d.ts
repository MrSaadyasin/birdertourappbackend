import mongoose, { Model } from 'mongoose';
import { BookingDTO } from 'src/dto/booking.dto';
import { Tour } from 'src/model/tour.model';
import { Booking } from 'src/model/booking.model';
import { Pricing } from 'src/model/pricing.model';
import { Stripe } from 'stripe';
import { User } from 'src/model/user.model';
import { DateTimeFormatter } from 'src/Utils/DateTimeFormatter.service';
import { NotificationService } from '../notification/notification.service';
import { EmailService } from 'src/Utils/Email.service';
import { FeedBack } from 'src/model/feedback.model';
export declare class BookingService {
    private readonly bookingModel;
    private readonly tourModel;
    private readonly pricingModle;
    private readonly userModel;
    private readonly stripeClient;
    private readonly feedBackModel;
    private dateTimeFormatter;
    private readonly emailService;
    private notificationService;
    constructor(bookingModel: Model<Booking>, tourModel: Model<Tour>, pricingModle: Model<Pricing>, userModel: Model<User>, stripeClient: Stripe, feedBackModel: Model<FeedBack>, dateTimeFormatter: DateTimeFormatter, emailService: EmailService, notificationService: NotificationService);
    AllBookings(): Promise<(mongoose.Document<unknown, {}, Booking> & Omit<Booking & {
        _id: mongoose.Types.ObjectId;
    }, never>)[]>;
    UpComingUserBookings(req: any): Promise<(mongoose.FlattenMaps<Booking> & {
        _id: mongoose.Types.ObjectId;
    })[]>;
    PendingUserBookings(req: any): Promise<(mongoose.FlattenMaps<Booking> & {
        _id: mongoose.Types.ObjectId;
    })[]>;
    RejectedUserBookings(req: any): Promise<(mongoose.FlattenMaps<Booking> & {
        _id: mongoose.Types.ObjectId;
    })[]>;
    UserBookingsHistory(req: any): Promise<(mongoose.FlattenMaps<Booking> & {
        _id: mongoose.Types.ObjectId;
    })[]>;
    UpComingVendorBookings(req: any): Promise<(mongoose.FlattenMaps<Booking> & {
        _id: mongoose.Types.ObjectId;
    })[]>;
    RequestedVendorBookings(req: any): Promise<(mongoose.FlattenMaps<Booking> & {
        _id: mongoose.Types.ObjectId;
    })[]>;
    UpdateRequestedBookingStatus(req: any): Promise<mongoose.Document<unknown, {}, Booking> & Omit<Booking & {
        _id: mongoose.Types.ObjectId;
    }, never>>;
    VendorBookingsHistory(req: any): Promise<(mongoose.FlattenMaps<Booking> & {
        _id: mongoose.Types.ObjectId;
    })[]>;
    VendorBookingStats(req: any): Promise<{
        totalCompletedTours: any;
        upComingsTours: number;
        totalEarning: any;
    }>;
    BookTour(body: BookingDTO, request: any): Promise<{
        booking: mongoose.Document<unknown, {}, Booking> & Omit<Booking & {
            _id: mongoose.Types.ObjectId;
        }, never>;
        stripeSession: Stripe.Response<Stripe.Checkout.Session>;
        message?: undefined;
    } | {
        message: string;
        booking: boolean;
        stripeSession?: undefined;
    }>;
    BookTourPaymentAfterApprove(body: BookingDTO, request: any): Promise<Stripe.Response<Stripe.Checkout.Session>>;
    BookingAvailability(request: any): Promise<{
        [x: number]: any;
    }>;
    UpdatedBookingAvailability(request: any): Promise<{
        [x: number]: any;
    }>;
    AvailableDates(tour_id: string): Promise<{
        full_day: any;
        half_day: any;
    }>;
}
