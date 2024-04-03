import { TourService } from './tour.service';
import { TourDTO } from 'src/dto/tour.dto';
import { Request, Response } from 'express';
import { TourSearchDTO } from 'src/dto/tour-search.dto';
export declare class TourController {
    private service;
    constructor(service: TourService);
    getAllTours(res: Response): Promise<Response<any, Record<string, any>>>;
    UpComingTours(res: Response): Promise<Response<any, Record<string, any>>>;
    searchTour(body: TourSearchDTO, res: Response, request: Request): Promise<Response<any, Record<string, any>>>;
    getPendingTours(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getApprovedTours(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getEditedTours(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getRejectedTours(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    create(request: Request, req: TourDTO, res: Response): Promise<Response<any, Record<string, any>>>;
    updateTour(req: Request, id: string, body: TourDTO, res: Response): Promise<Response<any, Record<string, any>>>;
    getTourDetail(tour_id: string, req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getAllBookings(tour_id: string, res: Response): Promise<Response<any, Record<string, any>>>;
    getUserTourDetail(tour_id: string, res: Response): Promise<Response<any, Record<string, any>>>;
    topTours(res: Response): Promise<Response<any, Record<string, any>>>;
}
