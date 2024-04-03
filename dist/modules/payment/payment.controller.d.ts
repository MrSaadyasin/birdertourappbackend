import { Request, Response } from 'express';
import { PaymentDto } from 'src/dto/payment.dto';
import { PaymentService } from './payment.service';
import { VendorPaymentDTO } from 'src/dto/vendorPayment.dto';
export declare class PaymentController {
    private service;
    constructor(service: PaymentService);
    createBooking(paymentDto: PaymentDto, res: Response): Promise<Response<any, Record<string, any>>>;
    connectWithStripe(res: Response, req: Request): Promise<Response<any, Record<string, any>>>;
    oauthCallback(code: string, req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    paymentRequest(body: Request, res: Response, req: Request): Promise<Response<any, Record<string, any>>>;
    paymentTourRequest(res: Response): Promise<Response<any, Record<string, any>>>;
    sendVendorPayment(body: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    updateVendorPaymentStatus(vendorPaymentDto: VendorPaymentDTO, res: Response): Promise<Response<any, Record<string, any>>>;
    vendorPaymentHistory(request: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    vendorPaymentStats(request: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    adminPaymentStats(request: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
