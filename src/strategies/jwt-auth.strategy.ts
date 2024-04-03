import {  Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import {  Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";



export type JwtPayload = { id: number; name: string; email: string; role: string; status: string };

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    const extractJwtFromHeader = (req: any) => {

      let token = null;
      // console.log(req.cookies,'cookie data is not saved')
      // let cookieToken = req.cookies.token;
    
      if (req.headers.authorization) {
        const [bearer, tokenValue] = req.headers.authorization.split(' ');

        if (bearer.toLowerCase() === 'bearer' && tokenValue) {
          token = tokenValue;
        }

      }
      // console.log(token, 'thsi is token')
      // if (cookieToken != token) { 
      //   throw new UnauthorizedException();
      // }
      return token;

    };

    super({
      jwtFromRequest: extractJwtFromHeader,
      ignoreExpiration: false,
      secretOrKey: process.env.SECRET_KEY,
    });
  }

  async validate(payload: JwtPayload) {
    // console.log(payload, 'this is payload')
    return { id: payload.id, name: payload.name, email: payload.email, role: payload.role, status: payload.status };
  }
}
