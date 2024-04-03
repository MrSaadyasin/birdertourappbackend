import { Request, Response } from 'express';
import { BlogService } from './blog.service';
import { BlogDTO } from 'src/dto/blog.dto';
export declare class BlogController {
    private service;
    constructor(service: BlogService);
    BlogList(res: Response): Promise<Response<any, Record<string, any>>>;
    BlogCreate(body: BlogDTO, request: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    BlogDelete(id: string, res: Response): Promise<Response<any, Record<string, any>>>;
    BlogEdit(slug: string, res: Response): Promise<Response<any, Record<string, any>>>;
    BlogUpdate(slug: string, request: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    BlogDetail(res: Response, slug: string): Promise<Response<any, Record<string, any>>>;
}
