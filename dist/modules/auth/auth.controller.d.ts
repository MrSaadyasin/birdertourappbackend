import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { UserDTO } from '../../dto/user.dto';
import { GoogleStrategy, GoogleVendorStrategy } from 'src/strategies/google.strategy';
export declare class AuthController {
    private service;
    private readonly googleAuthService;
    private readonly googleVendorAuthService;
    constructor(service: AuthService, googleAuthService: GoogleStrategy, googleVendorAuthService: GoogleVendorStrategy);
    Register(req: UserDTO, res: Response): Promise<Response<any, Record<string, any>>>;
    login(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    Logout(res: Response): Promise<Response<any, Record<string, any>>>;
    GetProfile(req: UserDTO, res: Response): Promise<Response<any, Record<string, any>>>;
    updateProfile(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    ForgotPassword(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    ResetPassword(req: any, res: Response): Promise<Response<any, Record<string, any>>>;
    UpdatePassword(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    allVendors(res: Response): Promise<Response<any, Record<string, any>>>;
    googleAuth(): Promise<{
        url: string;
    }>;
    googleVendorAuth(): Promise<{
        url: string;
    }>;
    googleAuthRedirect(code: string, role: string, res: Response): Promise<Response<any, Record<string, any>>>;
    googleVendorAuthRedirect(code: string, role: string, res: Response): Promise<Response<any, Record<string, any>>>;
    LoginWithFacebook(): void;
    FacebookCallback(role: any, res: Response, req: any): Promise<void>;
}
