import { Request, Response } from 'express';
import { ChatService } from './chat.service';
export declare class ChatController {
    private service;
    constructor(service: ChatService);
    sendMessage(body: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    chatProfileList(res: Response, request: Request): Promise<Response<any, Record<string, any>>>;
    chatMessageList(body: Request, res: Response, request: Request): Promise<Response<any, Record<string, any>>>;
    deleteChat(body: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
