import * as mongoose from 'mongoose';
export declare const tourSchema: mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
    versionKey: false;
}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    name: string;
    message: string;
    status: "pending" | "approved" | "rejected" | "edited";
    description: string;
    video: string;
    caption_images: any[];
    location: string;
    vendor?: mongoose.Types.ObjectId;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    name: string;
    message: string;
    status: "pending" | "approved" | "rejected" | "edited";
    description: string;
    video: string;
    caption_images: any[];
    location: string;
    vendor?: mongoose.Types.ObjectId;
}>> & Omit<mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    name: string;
    message: string;
    status: "pending" | "approved" | "rejected" | "edited";
    description: string;
    video: string;
    caption_images: any[];
    location: string;
    vendor?: mongoose.Types.ObjectId;
}> & {
    _id: mongoose.Types.ObjectId;
}, never>>;
