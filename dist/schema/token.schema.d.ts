import * as mongoose from 'mongoose';
export declare const tokenSchema: mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    createdAt: Date;
    user_id: mongoose.Types.ObjectId;
    token: string;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    createdAt: Date;
    user_id: mongoose.Types.ObjectId;
    token: string;
}>> & Omit<mongoose.FlatRecord<{
    createdAt: Date;
    user_id: mongoose.Types.ObjectId;
    token: string;
}> & {
    _id: mongoose.Types.ObjectId;
}, never>>;
