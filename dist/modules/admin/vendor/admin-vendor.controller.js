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
exports.AdminVendorController = void 0;
const common_1 = require("@nestjs/common");
const admin_vendor_service_1 = require("./admin-vendor.service");
const roles_guard_1 = require("../../../common/guards/roles.guard");
const has_roles_decorator_1 = require("../../../common/custom-decorators/has-roles.decorator");
const role_enum_1 = require("../../../common/enum/role.enum");
const passport_1 = require("@nestjs/passport");
let AdminVendorController = class AdminVendorController {
    constructor(service) {
        this.service = service;
    }
    async getPendingVendors(res) {
        const vendors = await this.service.getPendingVendors();
        return res.status(common_1.HttpStatus.OK).send({
            message: 'Pending Vendors Fetch Successfully',
            vendors: vendors
        });
    }
    async getApprovedVendors(res) {
        const vendors = await this.service.getApprovedVendors();
        return res.status(common_1.HttpStatus.OK).send({
            message: 'Approved Vendors Fetch Successfully',
            vendors: vendors
        });
    }
    async getRejectedVendors(res) {
        const vendors = await this.service.getRejectedVendors();
        return res.status(common_1.HttpStatus.OK).send({
            message: 'Rejected Vendors Fetch Successfully',
            vendors: vendors
        });
    }
    async updateStatus(req, res) {
        const updatedTour = await this.service.updateStatus(req);
        return res.status(common_1.HttpStatus.OK).send({
            message: 'Status update successfully',
            tour: updatedTour
        });
    }
    async getAllUserList(res) {
        const userList = await this.service.getAllUserList();
        return res.status(common_1.HttpStatus.OK).send({
            message: 'User list fetch successfully',
            userList: userList
        });
    }
    async getVendorDetail(vendor_id, res) {
        const vendorDetail = await this.service.getVendorDetail(vendor_id);
        return res.status(common_1.HttpStatus.OK).send({
            message: 'Vendor detail fetch successfully',
            vendorDetail: vendorDetail
        });
    }
    async addBadge(body, res) {
        const vendor = await this.service.addBadge(body);
        return res.status(common_1.HttpStatus.OK).send({
            message: vendor.badge === true ? 'Badge added successfully' : 'Badge removed successfully',
            vendor: vendor
        });
    }
};
__decorate([
    (0, common_1.Get)('pending'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminVendorController.prototype, "getPendingVendors", null);
__decorate([
    (0, common_1.Get)('approved'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminVendorController.prototype, "getApprovedVendors", null);
__decorate([
    (0, common_1.Get)('rejected'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminVendorController.prototype, "getRejectedVendors", null);
__decorate([
    (0, common_1.Post)('update-status'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AdminVendorController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Get)('user-list'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminVendorController.prototype, "getAllUserList", null);
__decorate([
    (0, common_1.Get)('detail'),
    __param(0, (0, common_1.Query)('vendor_id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminVendorController.prototype, "getVendorDetail", null);
__decorate([
    (0, common_1.Post)('add/badge'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AdminVendorController.prototype, "addBadge", null);
AdminVendorController = __decorate([
    (0, common_1.Controller)('admin/vendor'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, has_roles_decorator_1.HasRoles)(role_enum_1.Role.Admin),
    __metadata("design:paramtypes", [admin_vendor_service_1.AdminVendorService])
], AdminVendorController);
exports.AdminVendorController = AdminVendorController;
//# sourceMappingURL=admin-vendor.controller.js.map