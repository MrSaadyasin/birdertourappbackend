import { Model } from 'mongoose';
import { EmailService } from 'src/Utils/Email.service';
import { Booking } from 'src/model/booking.model';
import { User } from 'src/model/user.model';
export declare class CronService {
    private readonly bookingModel;
    private readonly userModel;
    private emailService;
    constructor(bookingModel: Model<Booking>, userModel: Model<User>, emailService: EmailService);
    vendorFeedBack(): Promise<void>;
    addBadge(): Promise<void>;
    upCommingVendorTourReminder(): Promise<void>;
    upCommingUserTourReminder(): Promise<void>;
}
