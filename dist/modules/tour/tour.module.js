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
exports.TourModule = void 0;
const common_1 = require("@nestjs/common");
const tour_controller_1 = require("./tour.controller");
const tour_service_1 = require("./tour.service");
const UploadFile_service_1 = require("../../Utils/UploadFile.service");
const DateTimeFormatter_service_1 = require("../../Utils/DateTimeFormatter.service");
const database_module_1 = require("../../common/database/database.module");
const notification_service_1 = require("../notification/notification.service");
let TourModule = class TourModule {
    constructor() {
        console.log('Tour Module');
    }
};
TourModule = __decorate([
    (0, common_1.Module)({
        imports: [
            database_module_1.DatabaseModule,
        ],
        controllers: [tour_controller_1.TourController],
        providers: [tour_service_1.TourService, UploadFile_service_1.FileUploadService, DateTimeFormatter_service_1.DateTimeFormatter, notification_service_1.NotificationService],
        exports: [],
    }),
    __metadata("design:paramtypes", [])
], TourModule);
exports.TourModule = TourModule;
//# sourceMappingURL=tour.module.js.map