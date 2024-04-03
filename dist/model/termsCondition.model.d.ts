import { Document } from 'mongoose';
export interface TermsCondition extends Document {
    terms_condition: string;
}
