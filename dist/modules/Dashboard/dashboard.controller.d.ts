import { Request, Response } from 'express';
import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private service;
    constructor(service: DashboardService);
    dashboardStats(res: Response): Promise<Response<any, Record<string, any>>>;
    getAllMailGroup(body: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
