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
import { Chat } from 'src/model/chat.model';
import { NotificationService } from '../notification/notification.service';
export declare class ChatService {
    private readonly chatModel;
    private notificationService;
    private pusher;
    constructor(chatModel: Model<Chat>, notificationService: NotificationService);
    chat(body: any): Promise<import("mongoose").Document<unknown, {}, Chat> & Omit<Chat & {
        _id: import("mongoose").Types.ObjectId;
    }, never>>;
    chatProfileList(request: any): Promise<any[]>;
    chatMessageList(body: any, request: any): Promise<any[]>;
    deleteChat(body: any): Promise<void>;
}
