import * as mongoose from 'mongoose';
export declare const feedBackSchema: mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
    versionKey: false;
}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    type: string;
    rating?: number;
    vendor?: mongoose.Types.ObjectId;
    user?: mongoose.Types.ObjectId;
    tour?: mongoose.Types.ObjectId;
    comment?: string;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    type: string;
    rating?: number;
    vendor?: mongoose.Types.ObjectId;
    user?: mongoose.Types.ObjectId;
    tour?: mongoose.Types.ObjectId;
    comment?: string;
}>> & Omit<mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    type: string;
    rating?: number;
    vendor?: mongoose.Types.ObjectId;
    user?: mongoose.Types.ObjectId;
    tour?: mongoose.Types.ObjectId;
    comment?: string;
}> & {
    _id: mongoose.Types.ObjectId;
}, never>>;
