import * as mongoose from 'mongoose';
export declare const wishlistSchema: mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
    versionKey: false;
}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    user?: mongoose.Types.ObjectId;
    tour?: mongoose.Types.ObjectId;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    user?: mongoose.Types.ObjectId;
    tour?: mongoose.Types.ObjectId;
}>> & Omit<mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    user?: mongoose.Types.ObjectId;
    tour?: mongoose.Types.ObjectId;
}> & {
    _id: mongoose.Types.ObjectId;
}, never>>;
