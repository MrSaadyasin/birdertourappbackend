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
import { User } from '../../model/user.model';
import { UserDTO } from '../../dto/user.dto';
import { JwtService } from '@nestjs/jwt';
import { Token } from '../../model/token.model';
import { EmailService } from 'src/Utils/Email.service';
import { GetFullUrl } from 'src/Utils/GetFulUrl';
import { FileUploadService } from 'src/Utils/UploadFile.service';
import { Request } from 'express';
import { DateTimeFormatter } from 'src/Utils/DateTimeFormatter.service';
import { NotificationService } from '../notification/notification.service';
export declare class AuthService {
    private readonly userModel;
    private readonly tokenModel;
    private readonly jwtService;
    private readonly emailService;
    private readonly fullUrlService;
    private fileUpload;
    private dateTimeFormatter;
    private notificationService;
    constructor(userModel: Model<User>, tokenModel: Model<Token>, jwtService: JwtService, emailService: EmailService, fullUrlService: GetFullUrl, fileUpload: FileUploadService, dateTimeFormatter: DateTimeFormatter, notificationService: NotificationService);
    register(req: UserDTO): Promise<import("mongoose").Document<unknown, {}, User> & Omit<User & {
        _id: import("mongoose").Types.ObjectId;
    }, never>>;
    login(req: Request): Promise<import("mongoose").Document<unknown, {}, User> & Omit<User & {
        _id: import("mongoose").Types.ObjectId;
    }, never>>;
    updateProfile(req: any): Promise<import("mongoose").Document<unknown, {}, User> & Omit<User & {
        _id: import("mongoose").Types.ObjectId;
    }, never>>;
    getProfile(req: UserDTO): Promise<import("mongoose").Document<unknown, {}, User> & Omit<User & {
        _id: import("mongoose").Types.ObjectId;
    }, never>>;
    forgotPassword(req: Request): Promise<void>;
    resetPassword(req: any): Promise<import("mongoose").Document<unknown, {}, User> & Omit<User & {
        _id: import("mongoose").Types.ObjectId;
    }, never>>;
    updatePassword(req: any): Promise<import("mongoose").Document<unknown, {}, User> & Omit<User & {
        _id: import("mongoose").Types.ObjectId;
    }, never>>;
    logout(res: any): Promise<any>;
    allVendors(): Promise<(import("mongoose").Document<unknown, {}, User> & Omit<User & {
        _id: import("mongoose").Types.ObjectId;
    }, never>)[]>;
    CheckSocialUser(req: any): Promise<import("mongoose").Document<unknown, {}, User> & Omit<User & {
        _id: import("mongoose").Types.ObjectId;
    }, never>>;
    CheckFacebookSocialUser(req: any): Promise<import("mongoose").Document<unknown, {}, User> & Omit<User & {
        _id: import("mongoose").Types.ObjectId;
    }, never>>;
    signPayload(user: any): Promise<string>;
    setCookieToken(token: any, res: any): Promise<void>;
    checkUserRedirection(url: string, req: Request): Promise<import("mongoose").Document<unknown, {}, User> & Omit<User & {
        _id: import("mongoose").Types.ObjectId;
    }, never>>;
}
