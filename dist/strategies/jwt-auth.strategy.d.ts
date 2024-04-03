import { ConfigService } from "@nestjs/config";
export type JwtPayload = {
    id: number;
    name: string;
    email: string;
    role: string;
    status: string;
};
declare const JwtAuthStrategy_base: new (...args: any[]) => any;
export declare class JwtAuthStrategy extends JwtAuthStrategy_base {
    constructor(configService: ConfigService);
    validate(payload: JwtPayload): Promise<{
        id: number;
        name: string;
        email: string;
        role: string;
        status: string;
    }>;
}
export {};
