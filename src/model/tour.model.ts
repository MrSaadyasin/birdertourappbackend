import { Document, Types } from 'mongoose';


export interface Tour extends Document {
    vendor: Types.ObjectId,
    name: string,
    video: string,
    // images: [],
    caption_images : [],
    description: String,
    status: string,
    location : string,
    message : string,
    pricing_type: string
}