import * as mongoose from 'mongoose';
export declare const chatSchema: mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
    versionKey: false;
}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    type: string;
    message: string;
    channel_name: string;
    is_read: boolean;
    vendor?: mongoose.Types.ObjectId;
    user?: mongoose.Types.ObjectId;
    sender?: mongoose.Types.ObjectId;
    receiver?: mongoose.Types.ObjectId;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    type: string;
    message: string;
    channel_name: string;
    is_read: boolean;
    vendor?: mongoose.Types.ObjectId;
    user?: mongoose.Types.ObjectId;
    sender?: mongoose.Types.ObjectId;
    receiver?: mongoose.Types.ObjectId;
}>> & Omit<mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    type: string;
    message: string;
    channel_name: string;
    is_read: boolean;
    vendor?: mongoose.Types.ObjectId;
    user?: mongoose.Types.ObjectId;
    sender?: mongoose.Types.ObjectId;
    receiver?: mongoose.Types.ObjectId;
}> & {
    _id: mongoose.Types.ObjectId;
}, never>>;
