import { Document, Types } from 'mongoose';


export interface Blog extends Document {
    user: Types.ObjectId,
    title: string,
    description: string,
    banner_image: string,
    slug: string,
    metaTitle: string,
    metaDescription : string,
    keywords : string
}