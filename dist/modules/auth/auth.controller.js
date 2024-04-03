"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const user_dto_1 = require("../../dto/user.dto");
const passport_1 = require("@nestjs/passport");
const google_strategy_1 = require("../../strategies/google.strategy");
const facebook_1 = require("@nestjs-hybrid-auth/facebook");
const files_interceptor_1 = require("../../common/interceptors/files.interceptor");
const has_roles_decorator_1 = require("../../common/custom-decorators/has-roles.decorator");
const role_enum_1 = require("../../common/enum/role.enum");
const roles_guard_1 = require("../../common/guards/roles.guard");
let AuthController = class AuthController {
    constructor(service, googleAuthService, googleVendorAuthService) {
        this.service = service;
        this.googleAuthService = googleAuthService;
        this.googleVendorAuthService = googleVendorAuthService;
    }
    async Register(req, res) {
        const user = await this.service.register(req);
        return res.status(common_1.HttpStatus.OK).send({
            message: 'Register Successfully'
        });
    }
    async login(req, res) {
        const user = await this.service.login(req);
        const token = await this.service.signPayload(user);
        await this.service.setCookieToken(token, res);
        return res.status(common_1.HttpStatus.OK).send({ user, token });
    }
    async Logout(res) {
        await this.service.logout(res);
        return res.status(common_1.HttpStatus.OK).send({
            message: 'Logout Successfully',
        });
    }
    async GetProfile(req, res) {
        const profile = await this.service.getProfile(req);
        return res.status(common_1.HttpStatus.OK).send({
            message: ' Profile Get Successfully',
            user: profile
        });
    }
    async updateProfile(req, res) {
        const user = await this.service.updateProfile(req);
        return res.status(common_1.HttpStatus.OK).send({
            message: 'Profile Update Successfully',
            user: user
        });
    }
    async ForgotPassword(req, res) {
        await this.service.forgotPassword(req);
        return res.status(common_1.HttpStatus.OK).send({
            message: 'Please Check you email for reset-password'
        });
    }
    async ResetPassword(req, res) {
        await this.service.resetPassword(req);
        return res.status(common_1.HttpStatus.OK).send({
            message: 'Password Update Successfully'
        });
    }
    async UpdatePassword(req, res) {
        await this.service.updatePassword(req);
        return res.status(common_1.HttpStatus.OK).send({
            message: 'Password Update Successfully'
        });
    }
    async allVendors(res) {
        const vendors = await this.service.allVendors();
        return res.status(common_1.HttpStatus.OK).send({
            message: 'Vendors fetch successfully',
            vendors: vendors
        });
    }
    async googleAuth() {
        const consentUrl = this.googleAuthService.createConsentUrl();
        return { url: consentUrl };
    }
    async googleVendorAuth() {
        const consentUrl = this.googleVendorAuthService.createConsentUrl();
        return { url: consentUrl };
    }
    async googleAuthRedirect(code, role, res) {
        const Checkeduser = await this.googleAuthService.authenticate(code);
        Checkeduser.role = role;
        const user = await this.service.CheckSocialUser(Checkeduser);
        const token = await this.service.signPayload(user);
        await this.service.setCookieToken(token, res);
        return res.status(common_1.HttpStatus.OK).send({ user, token });
    }
    async googleVendorAuthRedirect(code, role, res) {
        const Checkeduser = await this.googleVendorAuthService.authenticate(code);
        Checkeduser.role = role;
        const user = await this.service.CheckSocialUser(Checkeduser);
        const token = await this.service.signPayload(user);
        await this.service.setCookieToken(token, res);
        return res.status(common_1.HttpStatus.OK).send({ user, token });
    }
    LoginWithFacebook() {
    }
    async FacebookCallback(role, res, req) {
        const result = req.hybridAuthResult;
        const profile = result.profile._json;
        profile.role = role;
        let user = await this.service.CheckFacebookSocialUser(profile);
        const token = await this.service.signPayload(user);
        await this.service.setCookieToken(token, res);
        res.status(common_1.HttpStatus.OK).send({ user, token });
    }
};
__decorate([
    (0, common_1.Post)('register'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_dto_1.UserDTO, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "Register", null);
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Get)('logout'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "Logout", null);
__decorate([
    (0, common_1.Get)('profile'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_dto_1.UserDTO, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "GetProfile", null);
__decorate([
    (0, common_1.Post)('update-profile'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, has_roles_decorator_1.HasRoles)(role_enum_1.Role.Vendor, role_enum_1.Role.User),
    (0, common_1.UseInterceptors)(files_interceptor_1.FilesInterceptor),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Post)('forget-password'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "ForgotPassword", null);
__decorate([
    (0, common_1.Post)('reset-password'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "ResetPassword", null);
__decorate([
    (0, common_1.Post)('update-password'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "UpdatePassword", null);
__decorate([
    (0, common_1.Get)('vendors'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "allVendors", null);
__decorate([
    (0, common_1.Get)('google'),
    (0, common_1.Redirect)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleAuth", null);
__decorate([
    (0, common_1.Get)('google-vendor'),
    (0, common_1.Redirect)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleVendorAuth", null);
__decorate([
    (0, common_1.Get)('google/callback'),
    __param(0, (0, common_1.Query)('code')),
    __param(1, (0, common_1.Query)('role')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleAuthRedirect", null);
__decorate([
    (0, common_1.Get)('google/callback-vendor'),
    __param(0, (0, common_1.Query)('code')),
    __param(1, (0, common_1.Query)('role')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleVendorAuthRedirect", null);
__decorate([
    (0, facebook_1.UseFacebookAuth)(),
    (0, common_1.Get)('facebook'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "LoginWithFacebook", null);
__decorate([
    (0, facebook_1.UseFacebookAuth)(),
    (0, common_1.Get)('facebook/callback'),
    __param(0, (0, common_1.Query)('role')),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "FacebookCallback", null);
AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        google_strategy_1.GoogleStrategy,
        google_strategy_1.GoogleVendorStrategy])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map