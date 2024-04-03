import { Document, Types } from 'mongoose';
export interface VendorPayment extends Document {
    vendor: Types.ObjectId;
    booking: Types.ObjectId;
    tour: Types.ObjectId;
    total: number;
    payment_status: string;
    stripe_session_id: string;
}
