import mongoose, { Model } from 'mongoose';
import { FeedBackDTO } from '../../dto/feedback.dto';
import { FeedBack } from '../../model/feedback.model';
import { User } from 'src/model/user.model';
import { Booking } from 'src/model/booking.model';
export declare class FeedBackService {
    private readonly feedBackModel;
    private readonly userModel;
    private readonly bookingModel;
    constructor(feedBackModel: Model<FeedBack>, userModel: Model<User>, bookingModel: Model<Booking>);
    getAll(): Promise<Omit<Omit<mongoose.Document<unknown, {}, FeedBack> & Omit<FeedBack & {
        _id: mongoose.Types.ObjectId;
    }, never>, never>, never>[]>;
    pendingFeedBack(request: any): Promise<Omit<mongoose.Document<unknown, {}, Booking> & Omit<Booking & {
        _id: mongoose.Types.ObjectId;
    }, never>, never>[]>;
    add(req: FeedBackDTO): Promise<mongoose.Document<unknown, {}, Booking> & Omit<Booking & {
        _id: mongoose.Types.ObjectId;
    }, never>>;
}
