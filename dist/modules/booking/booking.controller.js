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
exports.BookingController = void 0;
const common_1 = require("@nestjs/common");
const booking_dto_1 = require("../../dto/booking.dto");
const roles_guard_1 = require("../../common/guards/roles.guard");
const has_roles_decorator_1 = require("../../common/custom-decorators/has-roles.decorator");
const role_enum_1 = require("../../common/enum/role.enum");
const passport_1 = require("@nestjs/passport");
const booking_service_1 = require("./booking.service");
let BookingController = class BookingController {
    constructor(service) {
        this.service = service;
    }
    async AllBookings(res) {
        const bookings = await this.service.AllBookings();
        return res.status(common_1.HttpStatus.OK).send({
            message: 'Bookings fetch successfully',
            bookings: bookings
        });
    }
    async BookTour(body, request, res) {
        const booking = await this.service.BookTour(body, request);
        return res.status(common_1.HttpStatus.OK).send({
            message: booking.message,
            booking: booking.booking === false ? "" : booking
        });
    }
    async BookTourPaymentAfterApprove(body, request, res) {
        const booking = await this.service.BookTourPaymentAfterApprove(body, request);
        return res.status(common_1.HttpStatus.OK).send({
            message: '',
            booking: booking
        });
    }
    async BookingAvailability(request, res) {
        const availability = await this.service.BookingAvailability(request);
        return res.status(common_1.HttpStatus.OK).send({
            message: '',
            availability: availability
        });
    }
    async AvailableDates(tour_id, res) {
        const availability = await this.service.AvailableDates(tour_id);
        return res.status(common_1.HttpStatus.OK).send({
            message: 'Available Dates fetch successfully',
            availability: availability
        });
    }
    async UpdatedBookingAvailability(request, res) {
        const availability = await this.service.UpdatedBookingAvailability(request);
        return res.status(common_1.HttpStatus.OK).send({
            message: '',
            availability: availability
        });
    }
    async UpComingUserBookings(req, res) {
        const bookings = await this.service.UpComingUserBookings(req);
        return res.status(common_1.HttpStatus.OK).send({
            message: 'Upcoming bookings fetch successfully',
            bookings: bookings
        });
    }
    async PendingUserBookings(req, res) {
        const bookings = await this.service.PendingUserBookings(req);
        return res.status(common_1.HttpStatus.OK).send({
            message: 'Pending bookings fetch successfully',
            bookings: bookings
        });
    }
    async RejectedUserBookings(req, res) {
        const bookings = await this.service.RejectedUserBookings(req);
        return res.status(common_1.HttpStatus.OK).send({
            message: 'Rejected bookings fetch successfully',
            bookings: bookings
        });
    }
    async UserBookingsHistory(req, res) {
        const bookingHistories = await this.service.UserBookingsHistory(req);
        return res.status(common_1.HttpStatus.OK).send({
            message: 'Bookings history fetch successfully',
            bookingHistories: bookingHistories
        });
    }
    async UpComingVendorBookings(req, res) {
        const upcomingBookings = await this.service.UpComingVendorBookings(req);
        return res.status(common_1.HttpStatus.OK).send({
            message: 'Upcoming bookings fetch successfully',
            upcomingBookings: upcomingBookings
        });
    }
    async RequestedBookings(req, res) {
        const requestedBookings = await this.service.RequestedVendorBookings(req);
        return res.status(common_1.HttpStatus.OK).send({
            message: 'Requested bookings fetch successfully',
            requestedBookings: requestedBookings
        });
    }
    async UpdateRequestedBookingStatus(req, res) {
        const requestedBookings = await this.service.UpdateRequestedBookingStatus(req);
        return res.status(common_1.HttpStatus.OK).send({
            message: 'Requested booking status updated successfully',
            requestedBookings
        });
    }
    async VendorBookingsHistory(req, res) {
        const bookingHistories = await this.service.VendorBookingsHistory(req);
        return res.status(common_1.HttpStatus.OK).send({
            message: 'Bookings history fetch successfully',
            bookingHistories: bookingHistories
        });
    }
    async VendorBookingStats(req, res) {
        const stats = await this.service.VendorBookingStats(req);
        return res.status(common_1.HttpStatus.OK).send({
            message: 'Stats fetch successfully',
            stats: stats
        });
    }
};
__decorate([
    (0, common_1.Get)('all'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "AllBookings", null);
__decorate([
    (0, common_1.Post)('tour'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, has_roles_decorator_1.HasRoles)(role_enum_1.Role.User),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [booking_dto_1.BookingDTO, Object, Object]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "BookTour", null);
__decorate([
    (0, common_1.Post)('payment'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, has_roles_decorator_1.HasRoles)(role_enum_1.Role.User),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [booking_dto_1.BookingDTO, Object, Object]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "BookTourPaymentAfterApprove", null);
__decorate([
    (0, common_1.Post)('availability'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "BookingAvailability", null);
__decorate([
    (0, common_1.Get)('available-dates'),
    __param(0, (0, common_1.Query)('tour_id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "AvailableDates", null);
__decorate([
    (0, common_1.Post)('updated-availability'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "UpdatedBookingAvailability", null);
__decorate([
    (0, common_1.Get)('user/upcoming'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, has_roles_decorator_1.HasRoles)(role_enum_1.Role.User),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "UpComingUserBookings", null);
__decorate([
    (0, common_1.Get)('user/pending'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, has_roles_decorator_1.HasRoles)(role_enum_1.Role.User),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "PendingUserBookings", null);
__decorate([
    (0, common_1.Get)('user/rejected'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, has_roles_decorator_1.HasRoles)(role_enum_1.Role.User),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "RejectedUserBookings", null);
__decorate([
    (0, common_1.Get)('user/history'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, has_roles_decorator_1.HasRoles)(role_enum_1.Role.User),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "UserBookingsHistory", null);
__decorate([
    (0, common_1.Get)('vendor/upcoming'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, has_roles_decorator_1.HasRoles)(role_enum_1.Role.Vendor),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "UpComingVendorBookings", null);
__decorate([
    (0, common_1.Get)('vendor/requested'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, has_roles_decorator_1.HasRoles)(role_enum_1.Role.Vendor),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "RequestedBookings", null);
__decorate([
    (0, common_1.Post)('vendor/requested/status'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, has_roles_decorator_1.HasRoles)(role_enum_1.Role.Vendor),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "UpdateRequestedBookingStatus", null);
__decorate([
    (0, common_1.Get)('vendor/history'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, has_roles_decorator_1.HasRoles)(role_enum_1.Role.Vendor),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "VendorBookingsHistory", null);
__decorate([
    (0, common_1.Get)('vendor/stats'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, has_roles_decorator_1.HasRoles)(role_enum_1.Role.Vendor),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "VendorBookingStats", null);
BookingController = __decorate([
    (0, common_1.Controller)('booking'),
    __metadata("design:paramtypes", [booking_service_1.BookingService])
], BookingController);
exports.BookingController = BookingController;
//# sourceMappingURL=booking.controller.js.map