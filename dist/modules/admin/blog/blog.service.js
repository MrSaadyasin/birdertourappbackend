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
exports.BlogService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const mongoose_2 = require("@nestjs/mongoose");
const UploadFile_service_1 = require("../../../Utils/UploadFile.service");
let BlogService = class BlogService {
    constructor(blogModel, fileUpload) {
        this.blogModel = blogModel;
        this.fileUpload = fileUpload;
    }
    async BlogList() {
        return await this.blogModel.find().sort({ createdAt: -1 });
    }
    async BlogCreate(body, request) {
        try {
            const { title, description, metaTitle, metaDescription, keywords } = body;
            const metaKeywords = keywords && JSON.parse(keywords);
            const user_id = request['user'].id;
            const files = request.files;
            if (!files.banner_image) {
                throw new common_1.HttpException('Banner Image is required', common_1.HttpStatus.BAD_REQUEST);
            }
            let banner_image;
            const image = files.banner_image[0];
            banner_image = await this.fileUpload.uploadSingleFile(image.buffer, image.originalname);
            return await this.blogModel.create({
                user: user_id,
                title: title,
                description: description,
                metaDescription: metaDescription,
                metaTitle: metaTitle,
                keywords: keywords ? metaKeywords.map((keyword) => keyword) : '',
                banner_image: banner_image.Location
            });
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async BlogDelete(id) {
        try {
            await this.blogModel.deleteOne({ _id: id });
            return;
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async BlogEdit(slug) {
        try {
            const blog = await this.blogModel.findOne({ slug: slug });
            return blog;
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async BlogUpdate(slug, request) {
        try {
            const { title, description, metaTitle, metaDescription, keywords } = request.body;
            const blog = await this.blogModel.findOne({ slug: slug });
            const metaKeywords = keywords && JSON.parse(keywords);
            if (blog) {
                if (request.files.banner_image) {
                    const files = request.files;
                    const image = files.banner_image[0];
                    const banner_image = await this.fileUpload.uploadSingleFile(image.buffer, image.originalname);
                    blog.banner_image = banner_image.Location;
                }
                blog.title = title;
                blog.description = description;
                blog.metaTitle = metaTitle;
                blog.metaDescription = metaDescription;
                blog.keywords = keywords ? metaKeywords.map((keyword) => keyword) : '';
                await blog.save();
                return blog;
            }
            else {
                throw new common_1.HttpException('Blog Not Found', common_1.HttpStatus.NOT_FOUND);
            }
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async BlogDetail(slug) {
        try {
            return await this.blogModel.findOne({ slug: slug });
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
BlogService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)('Blog')),
    __metadata("design:paramtypes", [mongoose_1.Model,
        UploadFile_service_1.FileUploadService])
], BlogService);
exports.BlogService = BlogService;
//# sourceMappingURL=blog.service.js.map