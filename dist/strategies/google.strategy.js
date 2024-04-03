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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleVendorStrategy = exports.GoogleStrategy = void 0;
const common_1 = require("@nestjs/common");
const google_auth_library_1 = require("google-auth-library");
let GoogleStrategy = class GoogleStrategy {
    constructor() {
        this.client = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, process.env.GOOGLE_REDIRECT_URL);
    }
    createConsentUrl() {
        const consentUrl = this.client.generateAuthUrl({
            access_type: 'offline',
            scope: ['email', 'profile'],
        });
        return consentUrl;
    }
    async authenticate(code) {
        const { tokens } = await this.client.getToken(code);
        this.client.setCredentials(tokens);
        const ticket = await this.client.verifyIdToken({
            idToken: tokens.id_token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const { name, email, picture, sub: google_id } = ticket.getPayload();
        const user = {
            google_id,
            name,
            email,
            picture,
            accessToken: tokens.access_token,
            refreshToken: tokens.refresh_token,
        };
        return user;
    }
};
GoogleStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], GoogleStrategy);
exports.GoogleStrategy = GoogleStrategy;
let GoogleVendorStrategy = class GoogleVendorStrategy {
    constructor() {
        this.client = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, process.env.GOOGLE_VENDOR_REDIRECT_URL);
    }
    createConsentUrl() {
        const consentUrl = this.client.generateAuthUrl({
            access_type: 'offline',
            scope: ['email', 'profile'],
        });
        return consentUrl;
    }
    async authenticate(code) {
        const { tokens } = await this.client.getToken(code);
        this.client.setCredentials(tokens);
        const ticket = await this.client.verifyIdToken({
            idToken: tokens.id_token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const { name, email, picture, sub: google_id } = ticket.getPayload();
        const user = {
            google_id,
            name,
            email,
            picture,
            accessToken: tokens.access_token,
            refreshToken: tokens.refresh_token,
        };
        return user;
    }
};
GoogleVendorStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], GoogleVendorStrategy);
exports.GoogleVendorStrategy = GoogleVendorStrategy;
//# sourceMappingURL=google.strategy.js.map