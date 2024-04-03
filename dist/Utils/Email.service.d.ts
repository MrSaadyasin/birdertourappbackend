export declare class EmailService {
    private transporter;
    constructor();
    sendPasswordResetEmail(email: string, name: string, link: string, subject: String): Promise<void>;
    upCommingVendorTourReminder(upCommingBooking: any, subject: string): Promise<void>;
    upCommingUserTourReminder(upCommingBooking: any, subject: string): Promise<void>;
    vendorPaymentRequest(booking: any, admin: any, subject: string): Promise<void>;
    sentUserTourPayment(booking: any, admin: any, subject: string): Promise<void>;
    vendorPaymentReceived(booking: any, admin: any, subject: string): Promise<void>;
    vendorFeedbackTour(bookings: any, subject: string): Promise<void>;
    userFeedbackTour(bookings: any, subject: string): Promise<void>;
    tourBookingRequestForVendor(email: string, name: string, username: string, useremail: string, tourname: string, dates: any, subject: String): Promise<void>;
    approveTourBookingRequestStatus(email: string, name: string, tourname: string, vendorname: string, link: string, date: any, dates: any, subject: String): Promise<void>;
    rejectedTourBookingRequestStatus(email: string, name: string, description: string, tourname: string, vendorname: string, subject: String): Promise<void>;
    updateTermsCondition(email: string, name: string, link: string, subject: string): Promise<void>;
    termsConditionForNewUser(email: string, name: string, link: string, subject: string): Promise<void>;
}
