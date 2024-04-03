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
exports.AdminTourModule = void 0;
const common_1 = require("@nestjs/common");
const admin_tour_controller_1 = require("./admin-tour.controller");
const admin_tour_service_1 = require("./admin-tour.service");
const database_module_1 = require("../../../common/database/database.module");
const notification_service_1 = require("../../notification/notification.service");
let AdminTourModule = class AdminTourModule {
    constructor() {
        console.log('Admin Tour Module');
    }
};
AdminTourModule = __decorate([
    (0, common_1.Module)({
        imports: [
            database_module_1.DatabaseModule,
        ],
        controllers: [admin_tour_controller_1.AdminTourController],
        providers: [admin_tour_service_1.AdminTourService, notification_service_1.NotificationService],
        exports: [],
    }),
    __metadata("design:paramtypes", [])
], AdminTourModule);
exports.AdminTourModule = AdminTourModule;
//# sourceMappingURL=admin-tour.module.js.map