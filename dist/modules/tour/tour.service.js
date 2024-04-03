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
exports.TourService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const mongoose_2 = require("@nestjs/mongoose");
const UploadFile_service_1 = require("../../Utils/UploadFile.service");
const DateTimeFormatter_service_1 = require("../../Utils/DateTimeFormatter.service");
const moment = require("moment");
const ipinfo = require("ipinfo");
const notification_service_1 = require("../notification/notification.service");
let TourService = class TourService {
    constructor(tourModel, pricingModel, feedBackModel, userModel, bookingModel, searchKeywordModel, fileUpload, notificationService, dateTimeFormatter) {
        this.tourModel = tourModel;
        this.pricingModel = pricingModel;
        this.feedBackModel = feedBackModel;
        this.userModel = userModel;
        this.bookingModel = bookingModel;
        this.searchKeywordModel = searchKeywordModel;
        this.fileUpload = fileUpload;
        this.notificationService = notificationService;
        this.dateTimeFormatter = dateTimeFormatter;
    }
    async getAll() {
        const startDate = moment().startOf('day');
        const tours = await this.tourModel.find({ status: 'approved' }).populate('vendor', 'name email start_date end_date profile_image badge rating').sort({ updatedAt: -1 });
        return this.getAllTours(tours);
    }
    async upComingsTours() {
        try {
            const startDate = moment().startOf('day');
            const endDate = startDate.clone().add(7, 'days').subtract(1, 'millisecond');
            const tours = await this.tourModel.find({ status: 'approved', updatedAt: { $gte: startDate.toDate(), $lte: endDate.toDate() } }).populate('vendor', 'name email badge');
            return this.getAllTours(tours);
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async searchTour(body, request) {
        try {
            const { type, name, address, date } = body;
            const startDate = moment().startOf('day');
            if (type === 'vendor') {
                await this.searchKeyword(name, request);
                const regex = new RegExp(name, 'i');
                let tours = await this.tourModel
                    .find({ status: 'approved' })
                    .populate({ path: 'vendor', match: { name: { $regex: regex }, role: 'vendor' }, select: 'name email available_time_slots start_date end_date' });
                if (!tours || tours.length === 0) {
                    return [];
                }
                if (!date) {
                    tours = tours.filter(tour => tour.vendor);
                    return this.getAllTours(tours);
                }
                const isTourAvailable = async (tour) => {
                    if (!tour.vendor) {
                        return false;
                    }
                    const isWithinDateRange = moment(date).isBetween(tour.vendor.start_date, tour.vendor.end_date, null, '[]');
                    if (!isWithinDateRange) {
                        return false;
                    }
                    const bookings = await this.bookingModel.find({ tour: tour._id, date: date });
                    if (bookings.some(booking => booking.booking_type === 'full_day')) {
                        return false;
                    }
                    const halfDayBookingCount = bookings.filter(booking => booking.booking_type === 'half_day').length;
                    if (halfDayBookingCount >= 2) {
                        return false;
                    }
                    return true;
                };
                const availabilityArray = await Promise.all(tours.map(isTourAvailable));
                tours = tours.filter((tour, index) => availabilityArray[index]);
                return this.getAllTours(tours);
            }
            if (type === 'location') {
                await this.searchKeyword(address, request);
                const tours = await this.tourModel
                    .find({ status: 'approved' })
                    .populate('vendor', 'name email address badge');
                const addressParts = address.split(',').map(part => part.trim());
                const filteredTours = tours.filter(tour => {
                    const vendorAddress = JSON.parse((tour).location).address;
                    if (vendorAddress) {
                        return addressParts.every(part => vendorAddress.includes(part));
                    }
                });
                return this.getAllTours(filteredTours);
            }
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async searchKeyword(keyword, request) {
        const ip = request.headers['x-forwarded-for'] || request.connection.remoteAddress;
        const location = await ipinfo(ip);
        return await this.searchKeywordModel.create({
            keyword: keyword.toLowerCase(),
            country_location: JSON.stringify(location)
        });
    }
    async create(req, request) {
        var _a;
        try {
            const { name, description, vendor_id, location, captions } = req;
            const captionArray = JSON.parse(captions);
            const vendor = await this.userModel.findOne({ _id: vendor_id });
            if (vendor.start_date === '' || vendor.end_date === '' || vendor.start_time === '' || vendor.end_time === '' || vendor.address === '') {
                throw new common_1.HttpException('Please complete your profile', common_1.HttpStatus.BAD_REQUEST);
            }
            const files = request.files;
            const images = files.images;
            if (!images) {
                throw new common_1.HttpException('Images are required', common_1.HttpStatus.BAD_REQUEST);
            }
            if (images.length > 10) {
                throw new common_1.HttpException('Images should not contain more than 10 items', common_1.HttpStatus.BAD_REQUEST);
            }
            const imageWithCaption = await Promise.all(images.map(async (image, index) => {
                const uploadedFile = await this.fileUpload.uploadSingleFile(image.buffer, image.originalname);
                return {
                    image: uploadedFile.Location,
                    caption: captionArray[index]
                };
            }));
            let file;
            if (((_a = files === null || files === void 0 ? void 0 : files.video) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                const video = files.video[0];
                file = await this.fileUpload.uploadSingleFile(video.buffer, video.originalname);
            }
            const tourObject = {
                name: name,
                description: description,
                video: file ? file.Location : '',
                caption_images: imageWithCaption,
                vendor: vendor_id,
                location: location,
            };
            const createdTour = new this.tourModel(tourObject);
            await createdTour.save();
            await this.notificationService.sendNotification('New Tour Register', 'New tour registered', undefined, vendor_id);
            return createdTour;
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async createTourPricing(tour, req) {
        try {
            const { full_day, half_day, hourly_bases, vendor_id } = req;
            const tourId = tour['_id'];
            const pricingObject = {
                vendor: vendor_id,
                tour: tourId,
                full_day: full_day,
                half_day: half_day,
            };
            const createdTourPrice = new this.pricingModel(pricingObject);
            await createdTourPrice.save();
            return createdTourPrice;
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async updateTourPricing(tour, body) {
        try {
            const { full_day, half_day, hourly_bases } = body;
            const tourId = tour['_id'];
            const pricing = await this.pricingModel.findOne({ tour: tourId });
            pricing.full_day = full_day;
            pricing.half_day = half_day;
            await pricing.save();
            return pricing;
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getPendingTours(req) {
        try {
            const id = req['user'].id;
            const tours = await this.tourModel.find({ status: 'pending', vendor: id }).populate('vendor', 'name email role profile_image badge');
            return this.getAllTours(tours);
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getApprovedTours(req) {
        try {
            const id = req['user'].id;
            const tours = await this.tourModel.find({ status: 'approved', vendor: id }).populate('vendor', 'name email role profile_image badge');
            return this.getAllTours(tours);
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getEditedTours(req) {
        try {
            const id = req['user'].id;
            const tours = await this.tourModel.find({ status: 'edited', vendor: id }).populate('vendor', 'name email role profile_image badge');
            return this.getAllTours(tours);
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getRejectedTours(req) {
        try {
            const id = req['user'].id;
            const tours = await this.tourModel.find({ status: 'rejected', vendor: id }).populate('vendor', 'name email role profile_image badge');
            return this.getAllTours(tours);
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async updateTour(id, body, request) {
        try {
            const { name, description, location, captions, old_images } = body;
            const old_images_array = JSON.parse(old_images);
            const vendor_id = request['user'].id;
            const captionArray = JSON.parse(captions);
            const tour = await this.tourModel.findById(id);
            if (tour) {
                const startDate = moment().startOf('day');
                const booking = await this.bookingModel.find({ tour: tour._id, payment_status: 'paid', date: { $gte: startDate.toDate() } });
                if (booking.length > 0) {
                    throw new common_1.HttpException('This tour already has booking', common_1.HttpStatus.BAD_REQUEST);
                }
                let existingImages = tour.caption_images;
                const imageUrlsFromDB = existingImages.map((imageObj) => imageObj.image);
                let updatedCaptionImages = [];
                let processedUrls = new Set();
                old_images_array.forEach(url => {
                    if (imageUrlsFromDB.includes(url) && !processedUrls.has(url)) {
                        let imageIndex = imageUrlsFromDB.indexOf(url);
                        updatedCaptionImages.push(existingImages[imageIndex]);
                        processedUrls.add(url);
                    }
                });
                const files = request.files;
                const images = files.images || [];
                if (images) {
                    if ((updatedCaptionImages.length + images.length) > 10) {
                        throw new common_1.HttpException('Images should not contain more than 10 items', common_1.HttpStatus.BAD_REQUEST);
                    }
                    const imageWithCaption = await Promise.all(images.map(async (image, index) => {
                        const uploadedFile = await this.fileUpload.uploadSingleFile(image.buffer, image.originalname);
                        return {
                            image: uploadedFile.Location,
                            caption: captionArray[index]
                        };
                    }));
                    updatedCaptionImages = [...updatedCaptionImages, ...imageWithCaption];
                }
                else {
                    updatedCaptionImages = existingImages;
                }
                let file;
                if (files.video) {
                    const video = files.video[0];
                    file = await this.fileUpload.uploadSingleFile(video.buffer, video.originalname);
                }
                tour.name = name;
                tour.description = description;
                tour.location = location;
                tour.video = file ? file.Location : tour.video;
                tour.caption_images = updatedCaptionImages;
                tour.status = 'edited';
                await tour.save();
                await this.notificationService.sendNotification('Tour Updated', `${tour.name} Tour Modified`, undefined, vendor_id);
                return tour;
            }
            else {
                throw new common_1.HttpException('Tour Not Found', common_1.HttpStatus.NOT_FOUND);
            }
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getTourDetail(req, tour_id) {
        try {
            const id = req['user'].id;
            let tour = await this.tourModel.findOne({ _id: tour_id, vendor: id }).populate('vendor', 'name email role profile_image badge booking_request documents languages description address');
            let pricing = await this.pricingModel.findOne({ tour: tour_id });
            const feedback = await this.feedBackModel.find({ tour: tour_id, type: 'user' });
            const tourWithFeedbacks = Object.assign(Object.assign({}, tour.toObject()), { pricing: pricing, feedbacks: feedback });
            return tourWithFeedbacks;
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getAllBookings(tour_id) {
        try {
            const startDate = moment().startOf('day');
            return await this.bookingModel.find({ tour: tour_id, payment_status: 'paid', date: { $lte: startDate.toDate() } }).populate('user', 'name email profile_image');
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getUserTourDetail(tour_id) {
        try {
            let tour = (await this.tourModel.findOne({ '_id': tour_id }).populate('vendor', 'name email profile_image rating description badge booking_request'));
            let pricing = await this.pricingModel.findOne({ 'tour': tour_id });
            const feedbacks = await this.feedBackModel.find({ type: 'user', vendor: tour.vendor._id }).populate('user', 'name profile_image');
            return Object.assign(Object.assign({}, tour.toObject()), { pricing: pricing, feedbacks: feedbacks });
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async topTours() {
        try {
            const topTours = await this.bookingModel.aggregate([
                { $match: { payment_status: 'paid' } },
                { $group: {
                        _id: '$tour',
                        numBookings: { $sum: 1 }
                    }
                },
                { $sort: { numBookings: -1 } },
                { $limit: 10 }
            ]);
            for (let i = 0; i < topTours.length; i++) {
                topTours[i].tour = await this.tourModel.findById(topTours[i]._id).populate('vendor', 'rating name email').exec();
                topTours[i].pricing = await this.pricingModel.findOne({ 'tour': topTours[i]._id }).exec();
            }
            return topTours;
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getAllTours(tours) {
        try {
            const tourIds = tours.map(tour => tour._id);
            const pricings = await this.pricingModel.find({ tour: { $in: tourIds } });
            const mergedData = tours.map(tour => {
                const pricing = pricings.find(pricing => pricing.tour.toString() === tour._id.toString());
                return Object.assign(Object.assign({}, tour['_doc']), { pricing: pricing ? pricing : null });
            });
            return mergedData;
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    compileBookedSlots(bookings) {
        const bookedSlots = {
            full_day: [],
            half_day: [],
            hourly_bases: []
        };
        bookings.forEach(booking => {
            if (booking.booking_type === 'full_day') {
                bookedSlots.full_day.push(this.dateTimeFormatter.convertToDate(booking.date));
            }
            else if (booking.booking_type === 'half_day') {
                bookedSlots.half_day.push(this.dateTimeFormatter.convertToDate(booking.date));
            }
        });
        return bookedSlots;
    }
};
TourService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)('Tour')),
    __param(1, (0, mongoose_2.InjectModel)('Pricing')),
    __param(2, (0, mongoose_2.InjectModel)('Feedback')),
    __param(3, (0, mongoose_2.InjectModel)('User')),
    __param(4, (0, mongoose_2.InjectModel)('Booking')),
    __param(5, (0, mongoose_2.InjectModel)('SearchKeyword')),
    __metadata("design:paramtypes", [mongoose_1.Model,
        mongoose_1.Model,
        mongoose_1.Model,
        mongoose_1.Model,
        mongoose_1.Model,
        mongoose_1.Model,
        UploadFile_service_1.FileUploadService,
        notification_service_1.NotificationService,
        DateTimeFormatter_service_1.DateTimeFormatter])
], TourService);
exports.TourService = TourService;
//# sourceMappingURL=tour.service.js.map