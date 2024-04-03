
import { Controller, Get, Req, Headers } from '@nestjs/common';
import { Request } from 'express';



export class GetFullUrl {
    getUrl(@Req() req: Request) {
        const referer = req.headers.referer;
        return referer;
    }
}