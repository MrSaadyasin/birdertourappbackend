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
exports.AdminVendorModule = void 0;
const common_1 = require("@nestjs/common");
const admin_vendor_controller_1 = require("./admin-vendor.controller");
const admin_vendor_service_1 = require("./admin-vendor.service");
const database_module_1 = require("../../../common/database/database.module");
const notification_service_1 = require("../../notification/notification.service");
let AdminVendorModule = class AdminVendorModule {
    constructor() {
        console.log('Admin Vendor Module');
    }
};
AdminVendorModule = __decorate([
    (0, common_1.Module)({
        imports: [
            database_module_1.DatabaseModule,
        ],
        controllers: [admin_vendor_controller_1.AdminVendorController],
        providers: [admin_vendor_service_1.AdminVendorService, notification_service_1.NotificationService],
        exports: [],
    }),
    __metadata("design:paramtypes", [])
], AdminVendorModule);
exports.AdminVendorModule = AdminVendorModule;
//# sourceMappingURL=admin-vendor.module.js.map