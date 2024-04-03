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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const mongoose_2 = require("@nestjs/mongoose");
const bcrypt = require("bcrypt");
const jwt_1 = require("@nestjs/jwt");
const Email_service_1 = require("../../Utils/Email.service");
const GetFulUrl_1 = require("../../Utils/GetFulUrl");
const UploadFile_service_1 = require("../../Utils/UploadFile.service");
const DateTimeFormatter_service_1 = require("../../Utils/DateTimeFormatter.service");
const notification_service_1 = require("../notification/notification.service");
let AuthService = class AuthService {
    constructor(userModel, tokenModel, jwtService, emailService, fullUrlService, fileUpload, dateTimeFormatter, notificationService) {
        this.userModel = userModel;
        this.tokenModel = tokenModel;
        this.jwtService = jwtService;
        this.emailService = emailService;
        this.fullUrlService = fullUrlService;
        this.fileUpload = fileUpload;
        this.dateTimeFormatter = dateTimeFormatter;
        this.notificationService = notificationService;
    }
    async register(req) {
        try {
            const { email, password, password_confirm, role } = req;
            if (password != password_confirm) {
                throw new common_1.HttpException('Password do not match', common_1.HttpStatus.BAD_REQUEST);
            }
            const user = await this.userModel.findOne({ email });
            if (user) {
                throw new common_1.HttpException('User Already Exist', common_1.HttpStatus.BAD_REQUEST);
            }
            if (role === 'admin') {
                const existingAdmin = await this.userModel.findOne({ role: 'admin' });
                if (existingAdmin) {
                    throw new common_1.HttpException(`Can't register as an admin`, common_1.HttpStatus.BAD_REQUEST);
                }
            }
            const createUser = new this.userModel(req);
            await createUser.save();
            if (createUser.role === 'vendor') {
                await this.notificationService.sendNotification('Vendor Sign Up', 'New vendor registered', undefined, createUser._id);
            }
            const link = `${process.env.APP_URL}terms-and-condition`;
            await this.emailService.termsConditionForNewUser(createUser.email, createUser === null || createUser === void 0 ? void 0 : createUser.name, link, `Terms & Condition`);
            return createUser;
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async login(req) {
        try {
            const url = this.fullUrlService.getUrl(req);
            const user = await this.checkUserRedirection(url, req);
            const { password } = req.body;
            if (await bcrypt.compare(password, user.password)) {
                return user;
            }
            else {
                throw new common_1.HttpException('invalid credential', common_1.HttpStatus.BAD_REQUEST);
            }
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async updateProfile(req) {
        var _a, _b;
        try {
            const { name, email, address, start_date, start_time, end_date, end_time, startTime, endTime, description, languages, dates, booking_request } = req.body;
            let user_id = req['user'].id;
            const files = req.files;
            let profile;
            if (((_a = files === null || files === void 0 ? void 0 : files.profile_image) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                const profile_image = files.profile_image[0];
                profile = await this.fileUpload.uploadSingleFile(profile_image.buffer, profile_image.originalname);
            }
            let documents;
            if (((_b = files === null || files === void 0 ? void 0 : files.documents) === null || _b === void 0 ? void 0 : _b.length) > 0) {
                documents = await Promise.all(files === null || files === void 0 ? void 0 : files.documents.map(async (document) => {
                    return this.fileUpload.uploadSingleFile(document.buffer, document.originalname);
                }));
            }
            let formated_start_date = start_date ? start_date : '';
            let formated_end_date = end_date ? end_date : '';
            let available_time_slots = start_time ? this.dateTimeFormatter.createTimeSlots(start_time, end_time) : '';
            let formated_start_time = start_time ? start_time : '';
            let formated_end_time = end_time ? end_time : '';
            let profileObject = {
                name: name,
                address: address,
                profile_image: undefined,
                documents: undefined,
                available_time_slots: undefined,
                start_date: formated_start_date,
                start_time: formated_start_time,
                languages: languages,
                end_date: formated_end_date,
                end_time: formated_end_time,
                startTime: startTime,
                endTime: endTime,
                description: description,
                booking_request: booking_request,
                dates: dates && JSON.parse(dates)
            };
            if (profile) {
                profileObject.profile_image = profile.Location;
            }
            if (documents && documents.length > 0) {
                profileObject.documents = documents.map((file) => ({ url: file.Location, filename: file.key }));
            }
            if (available_time_slots) {
                profileObject.available_time_slots = available_time_slots;
            }
            return await this.userModel.findOneAndUpdate({ "_id": user_id }, { $set: profileObject }, { new: true });
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getProfile(req) {
        try {
            const user_id = req['user'].id;
            return await this.userModel.findOne({ _id: user_id });
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async forgotPassword(req) {
        try {
            const url = this.fullUrlService.getUrl(req);
            const user = await this.checkUserRedirection(url, req);
            let { email } = req.body;
            let token;
            const Checktoken = await this.tokenModel.findOne({ user_id: user._id });
            if (!Checktoken) {
                token = await bcrypt.genSalt(10);
                await this.tokenModel.create({
                    user_id: user._id,
                    token: token
                });
            }
            const userName = user.name;
            let redirectLink = user.role == 'user' ? `${process.env.APP_URL}` : `${process.env.APP_VENDOR_URL}`;
            const link = `${redirectLink}updatePassword?user_id=${user._id}&token=${token}`;
            await this.emailService.sendPasswordResetEmail(email, userName, link, `Reset Your Password`);
            console.log('Email sent successfully');
            return;
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async resetPassword(req) {
        try {
            const { user_id, token, password, password_confirm } = req;
            const getGeneratedToken = await this.tokenModel.findOne({ user_id: user_id });
            if (token != (getGeneratedToken === null || getGeneratedToken === void 0 ? void 0 : getGeneratedToken.token)) {
                throw new common_1.HttpException('Invalid Or Expire Token', common_1.HttpStatus.BAD_REQUEST);
            }
            const user = await this.userModel.findOne({ _id: user_id });
            if (!user) {
                throw new common_1.HttpException('User Not Found', common_1.HttpStatus.BAD_REQUEST);
            }
            if (password != password_confirm) {
                throw new common_1.HttpException('Password does not match', common_1.HttpStatus.BAD_REQUEST);
            }
            user.password = password;
            await user.save();
            await getGeneratedToken.deleteOne();
            return user;
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async updatePassword(req) {
        try {
            const user_id = req['user'].id;
            const { old_password, new_password, confirm_password } = req.body;
            const user = await this.userModel.findOne({ _id: user_id });
            if (!user) {
                throw new common_1.HttpException('User Not Found', common_1.HttpStatus.BAD_REQUEST);
            }
            if (new_password != confirm_password) {
                throw new common_1.HttpException('Password does not match', common_1.HttpStatus.BAD_REQUEST);
            }
            if (await bcrypt.compare(old_password, user.password)) {
                user.password = new_password;
                return await user.save();
            }
            else {
                throw new common_1.HttpException('invalid credential', common_1.HttpStatus.BAD_REQUEST);
            }
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async logout(res) {
        try {
            return res.clearCookie('token');
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async allVendors() {
        try {
            return await this.userModel.find({ role: 'vendor', status: 'approved' }).select('name address rating profile_image');
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async CheckSocialUser(req) {
        try {
            const { name, email, google_id, role } = req;
            let user = await this.userModel.findOne({ email });
            if (user) {
                return user;
            }
            const createUser = new this.userModel({
                name: name,
                email: email,
                role: role,
                google_id: google_id
            });
            await createUser.save();
            return createUser;
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async CheckFacebookSocialUser(req) {
        try {
            const { id, first_name, last_name, role } = req;
            let user = await this.userModel.findOne({ facebook_id: id });
            if (user) {
                return user;
            }
            let email = first_name + last_name + '@facebook.com';
            const createUser = new this.userModel({
                name: first_name + last_name,
                email: email,
                role: role,
                facebook_id: id
            });
            await createUser.save();
            return createUser;
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async signPayload(user) {
        const { name, email, id, role, google_id, status } = user;
        const payload = {
            name: name,
            email: email,
            id: id,
            google_id: google_id,
            role: role,
            status: status
        };
        return this.jwtService.sign(payload);
    }
    async setCookieToken(token, res) {
        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            expires: new Date(Date.now() + 1 * 24 * 60 * 1000),
        });
    }
    async checkUserRedirection(url, req) {
        try {
            let { email } = req.body;
            email = email.trim().toLowerCase();
            const user = await this.userModel.findOne({ email });
            if (!user) {
                throw new common_1.HttpException('user not found', common_1.HttpStatus.BAD_REQUEST);
            }
            let role = user.role;
            if (process.env.APP_URL === url && role === 'user') {
                return user;
            }
            else if (process.env.APP_VENDOR_URL === url && (role === 'vendor' || 'admin')) {
                return user;
            }
            throw new common_1.HttpException('User not found', common_1.HttpStatus.BAD_REQUEST);
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)('User')),
    __param(1, (0, mongoose_2.InjectModel)('Token')),
    __metadata("design:paramtypes", [mongoose_1.Model,
        mongoose_1.Model,
        jwt_1.JwtService,
        Email_service_1.EmailService,
        GetFulUrl_1.GetFullUrl,
        UploadFile_service_1.FileUploadService,
        DateTimeFormatter_service_1.DateTimeFormatter,
        notification_service_1.NotificationService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map