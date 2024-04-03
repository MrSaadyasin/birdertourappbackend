import * as mongoose from 'mongoose';
export declare const searchKeywordSchema: mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
    versionKey: false;
}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    keyword: string;
    country_location: string;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    keyword: string;
    country_location: string;
}>> & Omit<mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    keyword: string;
    country_location: string;
}> & {
    _id: mongoose.Types.ObjectId;
}, never>>;
