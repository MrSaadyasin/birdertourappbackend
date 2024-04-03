import { IsString, MinLength, IsEmail } from 'class-validator';
import { Role } from 'src/common/enum/role.enum';

export class UserDTO {
  @IsString()
  @MinLength(4)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  @MinLength(8)
  password_confirm: string

  google_id: String;
  facebook_id: String;


  status: String
  message: String
  address: String
  languages: []
  documents: []
  available_time_slots: Object
  profile_image: String
  start_date: String
  end_date: String
  start_time: String
  end_time: String
  startTime: String
  endTime: String
  description: String
  rating: number
  badge : boolean

  // role: Role[]
  role: string
}

