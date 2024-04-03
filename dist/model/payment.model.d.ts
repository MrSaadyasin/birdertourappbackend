import { Document, Types } from 'mongoose';
export interface Payment extends Document {
    booking_id: Types.ObjectId;
    stripe_session_id: string;
}
