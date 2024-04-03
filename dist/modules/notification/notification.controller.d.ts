import { Request, Response } from 'express';
import { NotificationService } from './notification.service';
export declare class NotificationController {
    private service;
    constructor(service: NotificationService);
    Add(res: Response, request: Request): Promise<Response<any, Record<string, any>>>;
    getGeneralNotifications(res: Response, request: Request): Promise<Response<any, Record<string, any>>>;
}
