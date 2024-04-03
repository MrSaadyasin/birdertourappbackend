import * as mongoose from 'mongoose';
export declare const pricingSchema: mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
    versionKey: false;
}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    full_day?: string;
    half_day?: string;
    hourly_bases?: string;
    vendor?: mongoose.Types.ObjectId;
    tour?: mongoose.Types.ObjectId;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    full_day?: string;
    half_day?: string;
    hourly_bases?: string;
    vendor?: mongoose.Types.ObjectId;
    tour?: mongoose.Types.ObjectId;
}>> & Omit<mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    full_day?: string;
    half_day?: string;
    hourly_bases?: string;
    vendor?: mongoose.Types.ObjectId;
    tour?: mongoose.Types.ObjectId;
}> & {
    _id: mongoose.Types.ObjectId;
}, never>>;
