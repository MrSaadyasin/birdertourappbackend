import mongoose, { Model } from 'mongoose';
import { Stripe } from 'stripe';
import { PaymentDto } from 'src/dto/payment.dto';
import { Booking } from 'src/model/booking.model';
import { Payment } from 'src/model/payment.model';
import { User } from 'src/model/user.model';
import { Tour } from 'src/model/tour.model';
import { VendorPayment } from 'src/model/vendorPayment.model';
import { Pricing } from 'src/model/pricing.model';
import { VendorPaymentDTO } from 'src/dto/vendorPayment.dto';
import { EmailService } from 'src/Utils/Email.service';
import { NotificationService } from '../notification/notification.service';
export declare class PaymentService {
    private readonly stripeClient;
    private readonly bookingModel;
    private readonly paymentModel;
    private readonly userModel;
    private readonly tourModel;
    private readonly pricingModle;
    private readonly vendorPaymentModel;
    private notificationService;
    private emailService;
    constructor(stripeClient: Stripe, bookingModel: Model<Booking>, paymentModel: Model<Payment>, userModel: Model<User>, tourModel: Model<Tour>, pricingModle: Model<Pricing>, vendorPaymentModel: Model<VendorPayment>, notificationService: NotificationService, emailService: EmailService);
    createBooking(paymentDto: PaymentDto): Promise<void>;
    connectWithStripe(req: any): Promise<string>;
    createConnectAccount(code: string, req: any): Promise<mongoose.Document<unknown, {}, User> & Omit<User & {
        _id: mongoose.Types.ObjectId;
    }, never>>;
    paymentRequest(body: any, req: any): Promise<mongoose.Document<unknown, {}, Booking> & Omit<Booking & {
        _id: mongoose.Types.ObjectId;
    }, never>>;
    paymentTourRequest(): Promise<Omit<Omit<mongoose.Document<unknown, {}, Booking> & Omit<Booking & {
        _id: mongoose.Types.ObjectId;
    }, never>, never>, never>[]>;
    sendVendorPayment(body: any): Promise<Stripe.Response<Stripe.Checkout.Session>>;
    updateVendorPaymentStatus(vendorPayment: VendorPaymentDTO): Promise<void>;
    vendorPaymentHistory(req: any): Promise<Omit<mongoose.Document<unknown, {}, VendorPayment> & Omit<VendorPayment & {
        _id: mongoose.Types.ObjectId;
    }, never>, never>[]>;
    vendorPaymentStats(req: any): Promise<{
        incomingBalance: any;
        totalWithdrawn: any;
        currentBalance: number;
    }>;
    adminPaymentStats(req: any): Promise<{
        incomingBalance: any;
        totalWithdrawn: any;
        currentBalance: number;
    }>;
}
