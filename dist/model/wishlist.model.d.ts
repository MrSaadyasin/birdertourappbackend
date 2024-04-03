import { Document, Types } from 'mongoose';
export interface WishList extends Document {
    user: Types.ObjectId;
    tour: Types.ObjectId;
}
