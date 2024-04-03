import { FeedBackDTO } from '../../dto/feedback.dto';
import { Request, Response } from 'express';
import { FeedBackService } from './feedback.service';
export declare class FeedBackController {
    private service;
    constructor(service: FeedBackService);
    GetAll(res: Response): Promise<Response<any, Record<string, any>>>;
    Add(req: FeedBackDTO, res: Response, request: Request): Promise<Response<any, Record<string, any>>>;
    PendingFeedBack(res: Response, request: Request): Promise<Response<any, Record<string, any>>>;
}
