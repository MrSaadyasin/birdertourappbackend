
import { IsNumber, IsString } from 'class-validator';


export class PaymentDto {


    @IsString()
    stripe_session_id : string

    @IsString()
    booking_id: string;

}