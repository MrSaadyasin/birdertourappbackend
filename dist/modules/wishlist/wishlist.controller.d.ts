import { Request, Response } from 'express';
import { WishListService } from './wishlist.service';
import { WishListDTO } from 'src/dto/wishlist.dto';
export declare class WishListController {
    private service;
    constructor(service: WishListService);
    getAll(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    tour(req: WishListDTO, res: Response, request: Request): Promise<Response<any, Record<string, any>>>;
}
