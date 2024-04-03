import { IsNumber, IsString } from 'class-validator';


export class FeedBackDTO {

    user_id : string
    vendor_id: string


    tour_id: string
    booking_id : string

  
    rating : number

   
    comment: string

    status : string
}

