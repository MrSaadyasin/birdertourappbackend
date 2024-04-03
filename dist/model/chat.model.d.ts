import { Document, Types } from 'mongoose';
export interface Chat extends Document {
    user: Types.ObjectId;
    vendor: Types.ObjectId;
    sender: Types.ObjectId;
    receiver: Types.ObjectId;
    message: string;
    channel_name: string;
    is_read: Boolean;
    type: string;
}
