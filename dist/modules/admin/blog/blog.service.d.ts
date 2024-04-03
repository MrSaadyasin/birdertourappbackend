/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
import { Model } from 'mongoose';
import { BlogDTO } from 'src/dto/blog.dto';
import { Blog } from 'src/model/blog.model';
import { FileUploadService } from 'src/Utils/UploadFile.service';
export declare class BlogService {
    private readonly blogModel;
    private fileUpload;
    constructor(blogModel: Model<Blog>, fileUpload: FileUploadService);
    BlogList(): Promise<(import("mongoose").Document<unknown, {}, Blog> & Omit<Blog & {
        _id: import("mongoose").Types.ObjectId;
    }, never>)[]>;
    BlogCreate(body: BlogDTO, request: any): Promise<import("mongoose").Document<unknown, {}, Blog> & Omit<Blog & {
        _id: import("mongoose").Types.ObjectId;
    }, never>>;
    BlogDelete(id: string): Promise<void>;
    BlogEdit(slug: string): Promise<import("mongoose").Document<unknown, {}, Blog> & Omit<Blog & {
        _id: import("mongoose").Types.ObjectId;
    }, never>>;
    BlogUpdate(slug: string, request: any): Promise<import("mongoose").Document<unknown, {}, Blog> & Omit<Blog & {
        _id: import("mongoose").Types.ObjectId;
    }, never>>;
    BlogDetail(slug: string): Promise<import("mongoose").Document<unknown, {}, Blog> & Omit<Blog & {
        _id: import("mongoose").Types.ObjectId;
    }, never>>;
}
