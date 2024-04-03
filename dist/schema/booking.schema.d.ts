import * as mongoose from 'mongoose';
export declare const bookingSchema: mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
    versionKey: false;
}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    date: Date;
    start_time: string;
    end_time: string;
    dates: Date[];
    booking_type: "full_day" | "half_day" | "multi_day";
    total: number;
    booked_slot: string;
    is_reminder: boolean;
    payment_status: string;
    booking_request_status: "pending" | "approved" | "rejected";
    booking_request_reason: string;
    request_status: "pending" | "unpaid" | "paid" | "cancel";
    feedback_status: "pending" | "cancel" | "inProgress" | "success";
    vendor?: mongoose.Types.ObjectId;
    user?: mongoose.Types.ObjectId;
    tour?: mongoose.Types.ObjectId;
    extra_person?: number;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    date: Date;
    start_time: string;
    end_time: string;
    dates: Date[];
    booking_type: "full_day" | "half_day" | "multi_day";
    total: number;
    booked_slot: string;
    is_reminder: boolean;
    payment_status: string;
    booking_request_status: "pending" | "approved" | "rejected";
    booking_request_reason: string;
    request_status: "pending" | "unpaid" | "paid" | "cancel";
    feedback_status: "pending" | "cancel" | "inProgress" | "success";
    vendor?: mongoose.Types.ObjectId;
    user?: mongoose.Types.ObjectId;
    tour?: mongoose.Types.ObjectId;
    extra_person?: number;
}>> & Omit<mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    date: Date;
    start_time: string;
    end_time: string;
    dates: Date[];
    booking_type: "full_day" | "half_day" | "multi_day";
    total: number;
    booked_slot: string;
    is_reminder: boolean;
    payment_status: string;
    booking_request_status: "pending" | "approved" | "rejected";
    booking_request_reason: string;
    request_status: "pending" | "unpaid" | "paid" | "cancel";
    feedback_status: "pending" | "cancel" | "inProgress" | "success";
    vendor?: mongoose.Types.ObjectId;
    user?: mongoose.Types.ObjectId;
    tour?: mongoose.Types.ObjectId;
    extra_person?: number;
}> & {
    _id: mongoose.Types.ObjectId;
}, never>>;
