import * as mongoose from 'mongoose';
export declare const paymentSchema: mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
    versionKey: false;
}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    stripe_session_id: string;
    booking?: mongoose.Types.ObjectId;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    stripe_session_id: string;
    booking?: mongoose.Types.ObjectId;
}>> & Omit<mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    stripe_session_id: string;
    booking?: mongoose.Types.ObjectId;
}> & {
    _id: mongoose.Types.ObjectId;
}, never>>;
