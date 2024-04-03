import { IsNotEmpty, IsString, MinLength,ArrayMaxSize } from 'class-validator';


export class TourDTO {

   
    vendor_id: string;

    @IsString()
    @MinLength(6)
    name: string;

    @IsString()
    description: string;

    video: string;
    message: string;

    // @ArrayMaxSize(10, { message: 'Images should not contain more than 10 items' })
    // images: [];
    old_images : string


    @IsString()
    location: string;

    status: string;

  
    full_day: string;

 
    half_day: string;

  
    hourly_bases: string
    captions : string
}

