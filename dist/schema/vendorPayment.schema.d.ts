import * as mongoose from 'mongoose';
export declare const vendorPaymentSchema: mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
    versionKey: false;
}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    total: number;
    payment_status: string;
    vendor?: mongoose.Types.ObjectId;
    tour?: mongoose.Types.ObjectId;
    booking?: mongoose.Types.ObjectId;
    stripe_session_id?: string;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    total: number;
    payment_status: string;
    vendor?: mongoose.Types.ObjectId;
    tour?: mongoose.Types.ObjectId;
    booking?: mongoose.Types.ObjectId;
    stripe_session_id?: string;
}>> & Omit<mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    total: number;
    payment_status: string;
    vendor?: mongoose.Types.ObjectId;
    tour?: mongoose.Types.ObjectId;
    booking?: mongoose.Types.ObjectId;
    stripe_session_id?: string;
}> & {
    _id: mongoose.Types.ObjectId;
}, never>>;
