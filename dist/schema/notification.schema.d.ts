import * as mongoose from 'mongoose';
export declare const notificationSchema: mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
    versionKey: false;
}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    message: string;
    title: string;
    channel_name: string;
    vendor?: mongoose.Types.ObjectId;
    user?: mongoose.Types.ObjectId;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    message: string;
    title: string;
    channel_name: string;
    vendor?: mongoose.Types.ObjectId;
    user?: mongoose.Types.ObjectId;
}>> & Omit<mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    message: string;
    title: string;
    channel_name: string;
    vendor?: mongoose.Types.ObjectId;
    user?: mongoose.Types.ObjectId;
}> & {
    _id: mongoose.Types.ObjectId;
}, never>>;
