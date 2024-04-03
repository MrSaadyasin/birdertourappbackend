import { Response } from 'express';
import { TermsConditionDTO } from 'src/dto/termsCondition.dto';
import { TermsConditionService } from './termsCondition.service';
export declare class TermsConditionController {
    private service;
    constructor(service: TermsConditionService);
    get(res: Response): Promise<Response<any, Record<string, any>>>;
    createOrUpdate(termsConditionDto: TermsConditionDTO, res: Response): Promise<Response<any, Record<string, any>>>;
    topVendors(res: Response): Promise<Response<any, Record<string, any>>>;
}
