import { IsDateString,  IsString } from 'class-validator';


export class BookingDTO {

 
    user_id: string;
    booking_id : string

    @IsString()
    vendor_id : string;

    @IsString()
    tour_id: string;

    // @IsNumber()
    total: Number;

    // @IsDateString()
    date: Date
    booking_request_status : string
    booking_request_reason: string

    @IsString()
    booking_type: string;

    @IsString()
    time_slot: string

    extra_person: Number;
    payment_status: string
    request_status: string
    is_reminder : boolean
    dates : Date[]
}

