import { Document } from 'mongoose';
import { Types } from 'mongoose';

export interface Token extends Document {
    user_id: Types.ObjectId,
    token: String,
 
}