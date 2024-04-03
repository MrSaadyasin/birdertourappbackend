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
exports.PaymentController = void 0;
const common_1 = require("@nestjs/common");
const roles_guard_1 = require("../../common/guards/roles.guard");
const has_roles_decorator_1 = require("../../common/custom-decorators/has-roles.decorator");
const role_enum_1 = require("../../common/enum/role.enum");
const passport_1 = require("@nestjs/passport");
const payment_dto_1 = require("../../dto/payment.dto");
const payment_service_1 = require("./payment.service");
const vendorPayment_dto_1 = require("../../dto/vendorPayment.dto");
let PaymentController = class PaymentController {
    constructor(service) {
        this.service = service;
    }
    async createBooking(paymentDto, res) {
        const payment = await this.service.createBooking(paymentDto);
        return res.status(common_1.HttpStatus.OK).send({
            message: 'Payment status updated successfully'
        });
    }
    async connectWithStripe(res, req) {
        const url = await this.service.connectWithStripe(req);
        return res.status(common_1.HttpStatus.OK).send({
            url: url
        });
    }
    async oauthCallback(code, req, res) {
        const vendor = await this.service.createConnectAccount(code, req);
        return res.status(common_1.HttpStatus.OK).send({
            message: 'Stripe connected successfully',
            vendor: vendor
        });
    }
    async paymentRequest(body, res, req) {
        const booking = await this.service.paymentRequest(body, req);
        return res.status(common_1.HttpStatus.OK).send({
            message: 'Payment request send successfully',
            booking: booking
        });
    }
    async paymentTourRequest(res) {
        const paymentRequests = await this.service.paymentTourRequest();
        return res.status(common_1.HttpStatus.OK).send({
            message: 'Payment requests fetch successfully',
            paymentRequests: paymentRequests
        });
    }
    async sendVendorPayment(body, res) {
        const stripeSession = await this.service.sendVendorPayment(body);
        return res.status(common_1.HttpStatus.OK).send({
            stripeSession: stripeSession
        });
    }
    async updateVendorPaymentStatus(vendorPaymentDto, res) {
        await this.service.updateVendorPaymentStatus(vendorPaymentDto);
        return res.status(common_1.HttpStatus.OK).send({
            message: 'Payment status updated successfully'
        });
    }
    async vendorPaymentHistory(request, res) {
        const paymentHistory = await this.service.vendorPaymentHistory(request);
        return res.status(common_1.HttpStatus.OK).send({
            message: 'Payment history get successfully',
            paymentHistory: paymentHistory
        });
    }
    async vendorPaymentStats(request, res) {
        const paymentStats = await this.service.vendorPaymentStats(request);
        return res.status(common_1.HttpStatus.OK).send({
            message: 'Payment stats get successfully',
            paymentStats: paymentStats
        });
    }
    async adminPaymentStats(request, res) {
        const paymentStats = await this.service.adminPaymentStats(request);
        return res.status(common_1.HttpStatus.OK).send({
            message: 'Payment stats get successfully',
            paymentStats: paymentStats
        });
    }
};
__decorate([
    (0, common_1.Post)('update-status'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, has_roles_decorator_1.HasRoles)(role_enum_1.Role.User),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payment_dto_1.PaymentDto, Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "createBooking", null);
__decorate([
    (0, common_1.Get)('vendor/connect-stripe'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, has_roles_decorator_1.HasRoles)(role_enum_1.Role.Vendor),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "connectWithStripe", null);
__decorate([
    (0, common_1.Get)('callback'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, has_roles_decorator_1.HasRoles)(role_enum_1.Role.Vendor),
    __param(0, (0, common_1.Query)('code')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "oauthCallback", null);
__decorate([
    (0, common_1.Post)('request'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, has_roles_decorator_1.HasRoles)(role_enum_1.Role.Vendor),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "paymentRequest", null);
__decorate([
    (0, common_1.Get)('tour/request'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, has_roles_decorator_1.HasRoles)(role_enum_1.Role.Admin),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "paymentTourRequest", null);
__decorate([
    (0, common_1.Post)('vendor'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, has_roles_decorator_1.HasRoles)(role_enum_1.Role.Admin),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "sendVendorPayment", null);
__decorate([
    (0, common_1.Post)('vendor/update-status'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, has_roles_decorator_1.HasRoles)(role_enum_1.Role.Admin),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [vendorPayment_dto_1.VendorPaymentDTO, Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "updateVendorPaymentStatus", null);
__decorate([
    (0, common_1.Get)('vendor/history'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, has_roles_decorator_1.HasRoles)(role_enum_1.Role.Vendor),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "vendorPaymentHistory", null);
__decorate([
    (0, common_1.Get)('vendor/stats'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, has_roles_decorator_1.HasRoles)(role_enum_1.Role.Vendor),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "vendorPaymentStats", null);
__decorate([
    (0, common_1.Get)('admin/stats'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, has_roles_decorator_1.HasRoles)(role_enum_1.Role.Admin),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "adminPaymentStats", null);
PaymentController = __decorate([
    (0, common_1.Controller)('payment'),
    __metadata("design:paramtypes", [payment_service_1.PaymentService])
], PaymentController);
exports.PaymentController = PaymentController;
//# sourceMappingURL=payment.controller.js.map