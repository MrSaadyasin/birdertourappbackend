import { Document, Types } from 'mongoose';


export interface Booking extends Document {
    user: Types.ObjectId,
    vendor: Types.ObjectId,
    tour: Types.ObjectId,
    extra_person: number,
    total: number,
    date: Date,
    dates : Date[]
    booking_type:string,
    booked_slot :String
    start_time: string,
    booking_request_status: string,
    booking_request_reason : string,
    end_time: string,
    payment_status: string
    request_status: string
    is_reminder : boolean
}