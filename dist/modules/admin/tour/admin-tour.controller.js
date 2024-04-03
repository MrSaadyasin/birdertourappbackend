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
exports.AdminTourController = void 0;
const common_1 = require("@nestjs/common");
const admin_tour_service_1 = require("./admin-tour.service");
const roles_guard_1 = require("../../../common/guards/roles.guard");
const has_roles_decorator_1 = require("../../../common/custom-decorators/has-roles.decorator");
const role_enum_1 = require("../../../common/enum/role.enum");
const passport_1 = require("@nestjs/passport");
let AdminTourController = class AdminTourController {
    constructor(service) {
        this.service = service;
    }
    async getPendingTours(res) {
        const tours = await this.service.getPendingTours();
        return res.status(common_1.HttpStatus.OK).send({
            message: 'Pending Tours Fetch Successfully',
            tours: tours
        });
    }
    async getEditedTours(res) {
        const tours = await this.service.getEditedTours();
        return res.status(common_1.HttpStatus.OK).send({
            message: 'Edited Tours Fetch Successfully',
            tours: tours
        });
    }
    async getApprovedTours(res) {
        const tours = await this.service.getApprovedTours();
        return res.status(common_1.HttpStatus.OK).send({
            message: 'Approved Tours Fetch Successfully',
            tours: tours
        });
    }
    async getRejectedTours(res) {
        const tours = await this.service.getRejectedTours();
        return res.status(common_1.HttpStatus.OK).send({
            message: 'Rejected Tours Fetch Successfully',
            tours: tours
        });
    }
    async updateStatus(req, res) {
        const updatedTour = await this.service.updateStatus(req);
        return res.status(common_1.HttpStatus.OK).send({
            message: 'Status update successfully',
            tour: updatedTour
        });
    }
    async getKeywords(res) {
        const keywords = await this.service.searchKeywords();
        return res.status(common_1.HttpStatus.OK).send({
            message: 'Keywords fetch successfully',
            keywords
        });
    }
    async getTopSearchCountries(res) {
        const keywords = await this.service.getTopSearchKeywords();
        return res.status(common_1.HttpStatus.OK).send({
            message: 'Top search keywords countries fetch successfully',
            keywords
        });
    }
};
__decorate([
    (0, common_1.Get)('pending'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminTourController.prototype, "getPendingTours", null);
__decorate([
    (0, common_1.Get)('edited'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminTourController.prototype, "getEditedTours", null);
__decorate([
    (0, common_1.Get)('approved'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminTourController.prototype, "getApprovedTours", null);
__decorate([
    (0, common_1.Get)('rejected'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminTourController.prototype, "getRejectedTours", null);
__decorate([
    (0, common_1.Post)('update-status'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AdminTourController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Get)('search-keywords'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminTourController.prototype, "getKeywords", null);
__decorate([
    (0, common_1.Get)('search-top-keywords-countries'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminTourController.prototype, "getTopSearchCountries", null);
AdminTourController = __decorate([
    (0, common_1.Controller)('admin/tour'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, has_roles_decorator_1.HasRoles)(role_enum_1.Role.Admin),
    __metadata("design:paramtypes", [admin_tour_service_1.AdminTourService])
], AdminTourController);
exports.AdminTourController = AdminTourController;
//# sourceMappingURL=admin-tour.controller.js.map