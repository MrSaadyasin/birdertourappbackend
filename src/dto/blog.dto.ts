import { IsNumber, IsString } from 'class-validator';


export class BlogDTO {


    @IsString()
    title : string
    
    banner_image : string 
    @IsString()
    description: string
    metaTitle : string
    metaDescription : string
    keywords : string

}

