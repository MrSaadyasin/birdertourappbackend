import { IsDate, IsDateString, IsNotEmpty, IsNumber, IsString, MinLength } from 'class-validator';


export class VendorPaymentDTO {

    vendor_id : string
    tour_id: string
    booking_id : string
    total: Number
    payment_status: string
    stripe_session_id : string
}

