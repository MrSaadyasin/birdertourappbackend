import * as mongoose from 'mongoose';
export declare const blogSchema: mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
    versionKey: false;
}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    description: string;
    title: string;
    banner_image: string;
    keywords: string[];
    user?: mongoose.Types.ObjectId;
    slug?: string;
    metaTitle?: string;
    metaDescription?: string;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    description: string;
    title: string;
    banner_image: string;
    keywords: string[];
    user?: mongoose.Types.ObjectId;
    slug?: string;
    metaTitle?: string;
    metaDescription?: string;
}>> & Omit<mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    description: string;
    title: string;
    banner_image: string;
    keywords: string[];
    user?: mongoose.Types.ObjectId;
    slug?: string;
    metaTitle?: string;
    metaDescription?: string;
}> & {
    _id: mongoose.Types.ObjectId;
}, never>>;
