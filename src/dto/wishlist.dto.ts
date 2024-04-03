import { IsString } from 'class-validator';


export class WishListDTO {

    @IsString()
    tour_id: string;

}

