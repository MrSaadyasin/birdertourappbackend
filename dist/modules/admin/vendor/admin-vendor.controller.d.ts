import { AdminVendorService } from './admin-vendor.service';
import { Request, Response } from 'express';
export declare class AdminVendorController {
    private service;
    constructor(service: AdminVendorService);
    getPendingVendors(res: Response): Promise<Response<any, Record<string, any>>>;
    getApprovedVendors(res: Response): Promise<Response<any, Record<string, any>>>;
    getRejectedVendors(res: Response): Promise<Response<any, Record<string, any>>>;
    updateStatus(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getAllUserList(res: Response): Promise<Response<any, Record<string, any>>>;
    getVendorDetail(vendor_id: string, res: Response): Promise<Response<any, Record<string, any>>>;
    addBadge(body: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
