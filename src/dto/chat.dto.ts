import { IsNumber, IsString } from 'class-validator';


export class ChatDTO {

    @IsString()
    sender: string;

    @IsString()
    recipient: string;

    @IsString()
    message: string;

}

