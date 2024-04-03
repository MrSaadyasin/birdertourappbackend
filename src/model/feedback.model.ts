import { Document, Types } from 'mongoose';


export interface FeedBack extends Document {
    user: Types.ObjectId,
    vendor: Types.ObjectId,
    tour: Types.ObjectId,
    comment: string,
    rating : number,
    type: string
 
}