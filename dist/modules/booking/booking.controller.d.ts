import { BookingDTO } from 'src/dto/booking.dto';
import { Request, Response } from 'express';
import { BookingService } from './booking.service';
export declare class BookingController {
    private service;
    constructor(service: BookingService);
    AllBookings(res: Response): Promise<Response<any, Record<string, any>>>;
    BookTour(body: BookingDTO, request: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    BookTourPaymentAfterApprove(body: BookingDTO, request: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    BookingAvailability(request: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    AvailableDates(tour_id: string, res: Response): Promise<Response<any, Record<string, any>>>;
    UpdatedBookingAvailability(request: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    UpComingUserBookings(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    PendingUserBookings(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    RejectedUserBookings(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    UserBookingsHistory(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    UpComingVendorBookings(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    RequestedBookings(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    UpdateRequestedBookingStatus(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    VendorBookingsHistory(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    VendorBookingStats(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
