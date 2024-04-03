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
import { TermsConditionDTO } from 'src/dto/termsCondition.dto';
import { EmailService } from 'src/Utils/Email.service';
import { TermsCondition } from 'src/model/termsCondition.model';
import { User } from 'src/model/user.model';
export declare class TermsConditionService {
    private readonly termsConditionModel;
    private readonly userModel;
    private emailService;
    constructor(termsConditionModel: Model<TermsCondition>, userModel: Model<User>, emailService: EmailService);
    get(): Promise<(import("mongoose").Document<unknown, {}, TermsCondition> & Omit<TermsCondition & {
        _id: import("mongoose").Types.ObjectId;
    }, never>)[]>;
    createOrUpdate(termsConditionDto: TermsConditionDTO): Promise<void>;
    topVendors(): Promise<any[]>;
}
