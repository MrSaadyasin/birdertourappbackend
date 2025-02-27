import * as mongoose from 'mongoose';
import { Role } from 'src/common/enum/role.enum';
export declare const userSchema: mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
    versionKey: false;
}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    email: string;
    password: string;
    google_id: string;
    facebook_id: string;
    role: Role;
    message: string;
    status: "pending" | "approved" | "rejected";
    address: string;
    description: string;
    languages: string[];
    documents: any[];
    available_time_slots: any;
    profile_image: string;
    start_date: string;
    end_date: string;
    start_time: string;
    end_time: string;
    startTime: string;
    endTime: string;
    dates: string[];
    booking_request: "instant" | "requested";
    rating: number;
    badge: boolean;
    stripe_user_id: string;
    name?: string;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    email: string;
    password: string;
    google_id: string;
    facebook_id: string;
    role: Role;
    message: string;
    status: "pending" | "approved" | "rejected";
    address: string;
    description: string;
    languages: string[];
    documents: any[];
    available_time_slots: any;
    profile_image: string;
    start_date: string;
    end_date: string;
    start_time: string;
    end_time: string;
    startTime: string;
    endTime: string;
    dates: string[];
    booking_request: "instant" | "requested";
    rating: number;
    badge: boolean;
    stripe_user_id: string;
    name?: string;
}>> & Omit<mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    email: string;
    password: string;
    google_id: string;
    facebook_id: string;
    role: Role;
    message: string;
    status: "pending" | "approved" | "rejected";
    address: string;
    description: string;
    languages: string[];
    documents: any[];
    available_time_slots: any;
    profile_image: string;
    start_date: string;
    end_date: string;
    start_time: string;
    end_time: string;
    startTime: string;
    endTime: string;
    dates: string[];
    booking_request: "instant" | "requested";
    rating: number;
    badge: boolean;
    stripe_user_id: string;
    name?: string;
}> & {
    _id: mongoose.Types.ObjectId;
}, never>>;
