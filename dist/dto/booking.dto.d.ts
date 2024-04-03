export declare class BookingDTO {
    user_id: string;
    booking_id: string;
    vendor_id: string;
    tour_id: string;
    total: Number;
    date: Date;
    booking_request_status: string;
    booking_request_reason: string;
    booking_type: string;
    time_slot: string;
    extra_person: Number;
    payment_status: string;
    request_status: string;
    is_reminder: boolean;
    dates: Date[];
}
