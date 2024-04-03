import { Document, Types } from 'mongoose';
export interface Pricing extends Document {
    vendor: Types.ObjectId;
    tour: Types.ObjectId;
    full_day: String;
    half_day: String;
    hourly_bases: String;
}
