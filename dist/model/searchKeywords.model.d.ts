import { Document } from 'mongoose';
export interface SearchKeyword extends Document {
    keyword: string;
    country_location: string;
}
