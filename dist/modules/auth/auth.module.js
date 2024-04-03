"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const auth_controller_1 = require("./auth.controller");
const auth_service_1 = require("./auth.service");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const Email_service_1 = require("../../Utils/Email.service");
const google_strategy_1 = require("../../strategies/google.strategy");
const jwt_auth_strategy_1 = require("../../strategies/jwt-auth.strategy");
const GetFulUrl_1 = require("../../Utils/GetFulUrl");
const facebook_1 = require("@nestjs-hybrid-auth/facebook");
const UploadFile_service_1 = require("../../Utils/UploadFile.service");
const DateTimeFormatter_service_1 = require("../../Utils/DateTimeFormatter.service");
const notification_service_1 = require("../notification/notification.service");
const database_module_1 = require("../../common/database/database.module");
let AuthModule = class AuthModule {
};
AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot(),
            jwt_1.JwtModule.register({
                secret: process.env.SECRET_KEY,
                global: true,
                signOptions: { expiresIn: '7d' }
            }),
            database_module_1.DatabaseModule,
            facebook_1.FacebookAuthModule.forRoot({
                clientID: process.env.FACEBOOK_APP_ID,
                clientSecret: process.env.FACEBOOK_APP_SECRET,
                callbackURL: process.env.FACEBOOK_REDIRECT_URL,
                profileFields: ['id', 'emails', 'name']
            }),
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [auth_service_1.AuthService, Email_service_1.EmailService, notification_service_1.NotificationService, google_strategy_1.GoogleStrategy, google_strategy_1.GoogleVendorStrategy, jwt_auth_strategy_1.JwtAuthStrategy, GetFulUrl_1.GetFullUrl, UploadFile_service_1.FileUploadService, DateTimeFormatter_service_1.DateTimeFormatter],
        exports: [],
    })
], AuthModule);
exports.AuthModule = AuthModule;
//# sourceMappingURL=auth.module.js.map