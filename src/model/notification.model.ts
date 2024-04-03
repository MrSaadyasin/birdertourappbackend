import { Document, Types } from 'mongoose';


export interface Notification extends Document {
    vendor: Types.ObjectId,
    user: Types.ObjectId,
    message: string,
    title: string,
    channel_name : string
 
}