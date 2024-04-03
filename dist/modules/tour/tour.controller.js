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
exports.TourController = void 0;
const common_1 = require("@nestjs/common");
const tour_service_1 = require("./tour.service");
const roles_guard_1 = require("../../common/guards/roles.guard");
const has_roles_decorator_1 = require("../../common/custom-decorators/has-roles.decorator");
const role_enum_1 = require("../../common/enum/role.enum");
const passport_1 = require("@nestjs/passport");
const files_interceptor_1 = require("../../common/interceptors/files.interceptor");
const tour_dto_1 = require("../../dto/tour.dto");
const tour_search_dto_1 = require("../../dto/tour-search.dto");
let TourController = class TourController {
    constructor(service) {
        this.service = service;
    }
    async getAllTours(res) {
        const tours = await this.service.getAll();
        return res.status(common_1.HttpStatus.OK).send({
            message: 'Tours Fetch Successfully',
            tours: tours
        });
    }
    async UpComingTours(res) {
        const tours = await this.service.upComingsTours();
        return res.status(common_1.HttpStatus.OK).send({
            message: 'UpComing Tours Fetch Successfully',
            tours: tours
        });
    }
    async searchTour(body, res, request) {
        const tours = await this.service.searchTour(body, request);
        return res.status(common_1.HttpStatus.OK).send({
            message: 'Tours get Successfully',
            tours: tours
        });
    }
    async getPendingTours(req, res) {
        const tours = await this.service.getPendingTours(req);
        return res.status(common_1.HttpStatus.OK).send({
            message: 'Pending Tours Fetch Successfully',
            tours: tours
        });
    }
    async getApprovedTours(req, res) {
        const tours = await this.service.getApprovedTours(req);
        return res.status(common_1.HttpStatus.OK).send({
            message: 'Approved Tours Fetch Successfully',
            tours: tours
        });
    }
    async getEditedTours(req, res) {
        const tours = await this.service.getEditedTours(req);
        return res.status(common_1.HttpStatus.OK).send({
            message: 'Edited Tours Fetch Successfully',
            tours: tours
        });
    }
    async getRejectedTours(req, res) {
        const tours = await this.service.getRejectedTours(req);
        return res.status(common_1.HttpStatus.OK).send({
            message: 'Rejected Tours Fetch Successfully',
            tours: tours
        });
    }
    async create(request, req, res) {
        const tour = await this.service.create(req, request);
        if (!tour) {
            return res.status(common_1.HttpStatus.BAD_REQUEST).send({
                message: 'Something went wrong'
            });
        }
        await this.service.createTourPricing(tour, req);
        return res.status(common_1.HttpStatus.OK).send({
            message: 'Tour created successfully',
        });
    }
    async updateTour(req, id, body, res) {
        const tour = await this.service.updateTour(id, body, req);
        if (!tour) {
            return res.status(common_1.HttpStatus.BAD_REQUEST).send({
                message: 'Something went wrong'
            });
        }
        await this.service.updateTourPricing(tour, body);
        return res.status(common_1.HttpStatus.OK).send({
            message: 'Tour updated successfully',
        });
    }
    async getTourDetail(tour_id, req, res) {
        const tour = await this.service.getTourDetail(req, tour_id);
        return res.status(common_1.HttpStatus.OK).send({
            message: 'Tour Detail Get Successfully',
            tours: tour
        });
    }
    async getAllBookings(tour_id, res) {
        const bookings = await this.service.getAllBookings(tour_id);
        return res.status(common_1.HttpStatus.OK).send({
            message: 'Bookings fetch Successfully',
            bookings: bookings
        });
    }
    async getUserTourDetail(tour_id, res) {
        const tour = await this.service.getUserTourDetail(tour_id);
        return res.status(common_1.HttpStatus.OK).send({
            message: 'Tour Detail Get Successfully',
            tours: tour
        });
    }
    async topTours(res) {
        const tour = await this.service.topTours();
        return res.status(common_1.HttpStatus.OK).send({
            message: 'Top Tours Get Successfully',
            tours: tour
        });
    }
};
__decorate([
    (0, common_1.Get)('all'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TourController.prototype, "getAllTours", null);
__decorate([
    (0, common_1.Get)('upcoming'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TourController.prototype, "UpComingTours", null);
__decorate([
    (0, common_1.Post)('search-by-vendor-or-location'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [tour_search_dto_1.TourSearchDTO, Object, Object]),
    __metadata("design:returntype", Promise)
], TourController.prototype, "searchTour", null);
__decorate([
    (0, common_1.Get)('pending'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, has_roles_decorator_1.HasRoles)(role_enum_1.Role.Vendor),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TourController.prototype, "getPendingTours", null);
__decorate([
    (0, common_1.Get)('approved'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, has_roles_decorator_1.HasRoles)(role_enum_1.Role.Vendor),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TourController.prototype, "getApprovedTours", null);
__decorate([
    (0, common_1.Get)('edited'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, has_roles_decorator_1.HasRoles)(role_enum_1.Role.Vendor),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TourController.prototype, "getEditedTours", null);
__decorate([
    (0, common_1.Get)('rejected'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, has_roles_decorator_1.HasRoles)(role_enum_1.Role.Vendor),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TourController.prototype, "getRejectedTours", null);
__decorate([
    (0, common_1.Post)('create'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, has_roles_decorator_1.HasRoles)(role_enum_1.Role.Vendor),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    (0, common_1.UseInterceptors)(files_interceptor_1.FilesInterceptor),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, tour_dto_1.TourDTO, Object]),
    __metadata("design:returntype", Promise)
], TourController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)('update'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, has_roles_decorator_1.HasRoles)(role_enum_1.Role.Vendor),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    (0, common_1.UseInterceptors)(files_interceptor_1.FilesInterceptor),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('id')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, tour_dto_1.TourDTO, Object]),
    __metadata("design:returntype", Promise)
], TourController.prototype, "updateTour", null);
__decorate([
    (0, common_1.Get)('detail'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, has_roles_decorator_1.HasRoles)(role_enum_1.Role.Vendor),
    __param(0, (0, common_1.Query)('tour_id')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], TourController.prototype, "getTourDetail", null);
__decorate([
    (0, common_1.Get)('bookings'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, has_roles_decorator_1.HasRoles)(role_enum_1.Role.Vendor, role_enum_1.Role.Admin),
    __param(0, (0, common_1.Query)('tour_id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TourController.prototype, "getAllBookings", null);
__decorate([
    (0, common_1.Get)('details'),
    __param(0, (0, common_1.Query)('tour_id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TourController.prototype, "getUserTourDetail", null);
__decorate([
    (0, common_1.Get)('top'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TourController.prototype, "topTours", null);
TourController = __decorate([
    (0, common_1.Controller)('tour'),
    __metadata("design:paramtypes", [tour_service_1.TourService])
], TourController);
exports.TourController = TourController;
//# sourceMappingURL=tour.controller.js.map