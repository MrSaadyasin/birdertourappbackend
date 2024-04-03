import { AdminTourService } from './admin-tour.service';
import { Request, Response } from 'express';
export declare class AdminTourController {
    private service;
    constructor(service: AdminTourService);
    getPendingTours(res: Response): Promise<Response<any, Record<string, any>>>;
    getEditedTours(res: Response): Promise<Response<any, Record<string, any>>>;
    getApprovedTours(res: Response): Promise<Response<any, Record<string, any>>>;
    getRejectedTours(res: Response): Promise<Response<any, Record<string, any>>>;
    updateStatus(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getKeywords(res: Response): Promise<Response<any, Record<string, any>>>;
    getTopSearchCountries(res: Response): Promise<Response<any, Record<string, any>>>;
}
