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
exports.FileUploadService = void 0;
const aws_sdk_1 = require("aws-sdk");
const common_1 = require("@nestjs/common");
let FileUploadService = class FileUploadService {
    constructor() {
        this.bucketName = process.env.AWT_BUCKET_NAME;
        this.s3 = new aws_sdk_1.S3({
            accessKeyId: process.env.AWS_SDK_ACCESS_ID,
            secretAccessKey: process.env.AWS_SDK_SECRET_KEY,
        });
    }
    async uploadSingleFile(dataBuffer, filename) {
        try {
            const uploadResult = await this.s3.upload({
                Bucket: this.bucketName,
                Body: dataBuffer,
                Key: `${filename}`,
                ContentDisposition: 'inline',
            })
                .promise();
            return uploadResult;
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
FileUploadService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], FileUploadService);
exports.FileUploadService = FileUploadService;
//# sourceMappingURL=UploadFile.service.js.map