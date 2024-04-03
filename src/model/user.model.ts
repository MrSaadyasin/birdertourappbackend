import { Document } from 'mongoose';
import { Role } from 'src/common/enum/role.enum';


export interface DocumentObject {
    url: string;
    filename: string;
}
export interface User extends Document {
    name: String,
    email: String,
    password: String,
    google_id: String,
    facebook_id: String,
    status: String,
    message : String,
    address: String;
    languages: []
    available_time_slots : Object
    documents: DocumentObject[]
    profile_image: String
    description : String
    start_date : String
    end_date : String
    start_time :String
    end_time: String
    startTime :String
    endTime: String
    role: Role,
    rating : number,
    badge : Boolean,
    stripe_user_id : string,
    booking_request : string,
    dates : []
}