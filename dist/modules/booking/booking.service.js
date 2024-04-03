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
exports.BookingService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const mongoose_2 = require("@nestjs/mongoose");
const stripe_1 = require("stripe");
const DateTimeFormatter_service_1 = require("../../Utils/DateTimeFormatter.service");
const moment = require("moment");
const notification_service_1 = require("../notification/notification.service");
const Email_service_1 = require("../../Utils/Email.service");
let BookingService = class BookingService {
    constructor(bookingModel, tourModel, pricingModle, userModel, stripeClient, feedBackModel, dateTimeFormatter, emailService, notificationService) {
        this.bookingModel = bookingModel;
        this.tourModel = tourModel;
        this.pricingModle = pricingModle;
        this.userModel = userModel;
        this.stripeClient = stripeClient;
        this.feedBackModel = feedBackModel;
        this.dateTimeFormatter = dateTimeFormatter;
        this.emailService = emailService;
        this.notificationService = notificationService;
    }
    async AllBookings() {
        return await this.bookingModel.find();
    }
    async UpComingUserBookings(req) {
        try {
            const user_id = req['user'].id;
            const startDate = moment().startOf('day');
            let upcomingBookings = await this.bookingModel.find({ user: user_id, payment_status: 'paid',
                $or: [
                    { date: { $gte: startDate } },
                    {
                        $and: [
                            { dates: { $ne: [] } },
                            { dates: { $elemMatch: { $gte: startDate } } }
                        ]
                    }
                ]
            }).populate('vendor', 'name email profile_image badge').populate('tour')
                .lean();
            for (let booking of upcomingBookings) {
                const pricing = await this.pricingModle.findOne({ tour: booking.tour._id });
                booking.tour['pricing'] = pricing;
            }
            return upcomingBookings;
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async PendingUserBookings(req) {
        try {
            const user_id = req['user'].id;
            let pendingBookings = await this.bookingModel.find({ user: user_id, payment_status: 'unpaid', booking_request_status: { $ne: 'rejected' } }).populate('vendor', 'name email profile_image badge').populate('tour')
                .lean();
            for (let booking of pendingBookings) {
                const pricing = await this.pricingModle.findOne({ tour: booking.tour._id });
                booking.tour['pricing'] = pricing;
            }
            return pendingBookings;
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async RejectedUserBookings(req) {
        try {
            const user_id = req['user'].id;
            let rejectedBookings = await this.bookingModel.find({ user: user_id, payment_status: 'unpaid', booking_request_status: 'rejected' }).populate('vendor', 'name email profile_image badge').populate('tour')
                .lean();
            for (let booking of rejectedBookings) {
                const pricing = await this.pricingModle.findOne({ tour: booking.tour._id });
                booking.tour['pricing'] = pricing;
            }
            return rejectedBookings;
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async UserBookingsHistory(req) {
        try {
            const user_id = req['user'].id;
            const startDate = moment().startOf('day');
            let upcomingBookings = await this.bookingModel.find({ user: user_id,
                $or: [
                    { date: { $lte: startDate } },
                    {
                        $and: [
                            { dates: { $ne: [] } },
                            { dates: { $elemMatch: { $lte: startDate } } }
                        ]
                    }
                ]
            }).populate('vendor', 'name email profile_image badge').populate('tour')
                .sort({ date: 1 })
                .lean();
            for (let booking of upcomingBookings) {
                const pricing = await this.pricingModle.findOne({ tour: booking.tour._id });
                booking.tour['pricing'] = pricing;
            }
            return upcomingBookings;
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async UpComingVendorBookings(req) {
        try {
            const vendor_id = req['user'].id;
            const startDate = moment().startOf('day');
            let upcomingBookings = await this.bookingModel.find({ vendor: vendor_id, payment_status: 'paid',
                booking_request_status: 'approved',
                $or: [
                    { date: { $gte: startDate } },
                    {
                        $and: [
                            { dates: { $ne: [] } },
                            { dates: { $elemMatch: { $gte: startDate } } }
                        ]
                    }
                ]
            }).populate('user', 'name email profile_image languages description address documents rating').populate('tour')
                .sort({ updatedAt: 1 })
                .lean();
            for (let booking of upcomingBookings) {
                let feedback = await this.feedBackModel.find({ user: booking.user._id, type: { $ne: 'user' } }).populate('vendor', 'name email profile_image');
                const pricing = await this.pricingModle.findOne({ tour: booking.tour._id });
                booking.tour['pricing'] = pricing;
                booking.user['feedback'] = feedback;
            }
            return upcomingBookings;
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async RequestedVendorBookings(req) {
        try {
            const vendor_id = req['user'].id;
            const startDate = moment().startOf('day');
            let requestedBookings = await this.bookingModel.find({ vendor: vendor_id, booking_request_status: 'pending', $or: [
                    { date: { $gte: startDate } },
                    {
                        $and: [
                            { dates: { $ne: [] } },
                            { dates: { $elemMatch: { $gte: startDate } } }
                        ]
                    }
                ] }).populate('user', 'name email profile_image languages description address documents rating').populate('tour')
                .sort({ updatedAt: 1 })
                .lean();
            for (let booking of requestedBookings) {
                let feedback = await this.feedBackModel.find({ user: booking.user._id, type: { $ne: 'user' } }).populate('vendor', 'name email profile_image');
                const pricing = await this.pricingModle.findOne({ tour: booking.tour._id });
                booking.tour['pricing'] = pricing;
                booking.user['feedback'] = feedback;
            }
            return requestedBookings;
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async UpdateRequestedBookingStatus(req) {
        try {
            const vendor_id = req['user'].id;
            const { booking_id, booking_request_reason, booking_request_status } = req.body;
            const booking = await this.bookingModel.findOneAndUpdate({ vendor: vendor_id, _id: booking_id }, { $set: { booking_request_status: booking_request_status, booking_request_reason: booking_request_reason } }, { new: true }).populate('tour').populate('vendor', 'name');
            const user = await this.userModel.findOne({ _id: booking.user });
            if (booking.booking_request_status === 'approved') {
                const url = `${process.env.APP_URL}bookings`;
                await this.emailService.approveTourBookingRequestStatus(user.email, user === null || user === void 0 ? void 0 : user.name, booking.tour.name, booking.vendor.name, url, booking.date, booking.dates, `Approve Booking Request`);
                console.log('Email sent successfully');
                return;
            }
            else if (booking.booking_request_status === 'rejected') {
                await this.emailService.rejectedTourBookingRequestStatus(user.email, user === null || user === void 0 ? void 0 : user.name, booking_request_reason, booking.tour.name, booking.vendor.name, `Rejected Booking Request`);
            }
            return booking;
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async VendorBookingsHistory(req) {
        try {
            const vendor_id = req['user'].id;
            const startDate = moment().startOf('day');
            let upcomingBookings = await this.bookingModel.find({ vendor: vendor_id, payment_status: 'paid', date: { $lte: startDate.toDate() } }).populate('user', 'name email profile_image languages description address documents rating').populate('tour')
                .sort({ date: 1 })
                .lean();
            for (let booking of upcomingBookings) {
                let feedback = await this.feedBackModel.find({ user: booking.user._id, type: { $ne: 'user' } }).populate('vendor', 'name email profile_image');
                const pricing = await this.pricingModle.findOne({ tour: booking.tour._id });
                booking.tour['pricing'] = pricing;
                booking.user['feedback'] = feedback;
            }
            return upcomingBookings;
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async VendorBookingStats(req) {
        try {
            const vendor_id = req['user'].id;
            const startDate = moment().startOf('day');
            const completedTourCount = await this.bookingModel.aggregate([
                {
                    $match: {
                        vendor: new mongoose_1.default.Types.ObjectId(vendor_id),
                        payment_status: 'paid',
                        date: { $lte: startDate.toDate() }
                    }
                },
                {
                    $group: {
                        _id: "$tour",
                        count: { $sum: 1 }
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalCompletedTours: { $sum: "$count" }
                    }
                }
            ]);
            const totalCompletedTours = completedTourCount.length > 0 ? completedTourCount[0].totalCompletedTours : 0;
            const upComingsTours = (await this.bookingModel.find({ vendor: vendor_id, payment_status: 'paid', date: { $gte: startDate.toDate() } })).length;
            const vendorObjectId = new mongoose_1.default.Types.ObjectId(vendor_id);
            const totalEarningQuery = await this.bookingModel.aggregate([
                {
                    $match: {
                        vendor: vendorObjectId,
                        payment_status: 'paid',
                        request_status: 'paid'
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: '$total' }
                    }
                }
            ]);
            return {
                totalCompletedTours: totalCompletedTours,
                upComingsTours: upComingsTours,
                totalEarning: totalEarningQuery.length > 0 ? totalEarningQuery[0].total : 0
            };
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async BookTour(body, request) {
        try {
            const user = request['user'];
            const { tour_id, vendor_id, extra_person, total, date, time_slot, booking_type } = body;
            const vendor = await this.userModel.findOne({ _id: vendor_id }).select('name email start_date start_time end_date end_time badge booking_request');
            let requested_time_slot = this.dateTimeFormatter.processTimeSlot(time_slot);
            const tour = await this.tourModel.findOne({ _id: tour_id });
            const bookingObject = {
                user: user.id,
                vendor: vendor_id,
                tour: tour_id,
                extra_person: extra_person,
                total: total,
                booking_type: booking_type,
                date: (booking_type === 'half_day' || booking_type === 'full_day') ? date : "",
                dates: booking_type === 'multi_day' ? JSON.parse(date) : [],
                start_time: requested_time_slot.startTime,
                end_time: requested_time_slot.endTime,
                booked_slot: time_slot,
                booking_request_status: vendor.booking_request === 'requested' ? 'pending' : 'approved'
            };
            const booking = await new this.bookingModel(bookingObject).save();
            if (booking && vendor.booking_request === 'instant') {
                const stripeSession = await this.stripeClient.checkout.sessions.create({
                    payment_method_types: ['card'],
                    line_items: [{
                            price_data: {
                                currency: 'usd',
                                product_data: {
                                    name: tour.name,
                                    description: `Guide:${vendor.name}
                                , Slot: ${time_slot} 
                                , Date: ${date}`,
                                    images: ['https://dashboard.earthbirder.com/_next/static/media/logo.0830fd2c.svg']
                                },
                                unit_amount: Number(total) * 100,
                            },
                            quantity: 1,
                        }],
                    mode: 'payment',
                    success_url: `${process.env.APP_URL}payment/success?session_id={CHECKOUT_SESSION_ID}`,
                    cancel_url: `${process.env.APP_URL}payment/cancel?session_id={CHECKOUT_SESSION_ID}`,
                    metadata: {
                        start_date: requested_time_slot.startTime,
                        end_date: requested_time_slot.endTime,
                        additional_info: 'This is the additional information.'
                    }
                });
                await this.notificationService.sendNotification('Tour New Booking', `${tour.name} is booked by ${user.name}`, undefined, vendor_id, "vendor");
                return {
                    booking,
                    stripeSession: stripeSession
                };
            }
            else {
                await this.notificationService.sendNotification('Tour New Booking Request', `${tour.name} booking request by ${user.name}`, undefined, vendor_id, "vendor");
                await this.emailService.tourBookingRequestForVendor(vendor === null || vendor === void 0 ? void 0 : vendor.email, vendor === null || vendor === void 0 ? void 0 : vendor.name, user.name, user.email, tour.name, date, `Tour Booking Request`);
                console.log('Email sent successfully');
                return {
                    message: 'Tour booking request sent',
                    booking: false
                };
            }
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async BookTourPaymentAfterApprove(body, request) {
        try {
            const user = request['user'];
            const { booking_id } = body;
            const booking = await this.bookingModel.findOne({ _id: booking_id, user: user.id, payment_status: 'unpaid', booking_request_status: 'approved' }).populate('tour').populate('vendor');
            const tour_name = booking.tour.name;
            const guide = booking.vendor.name;
            const stripeSession = await this.stripeClient.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: [{
                        price_data: {
                            currency: 'usd',
                            product_data: {
                                name: tour_name,
                                description: `Guide:${guide}
                                , Slot: ${booking.booked_slot} `,
                                images: ['https://dashboard.earthbirder.com/_next/static/media/logo.0830fd2c.svg']
                            },
                            unit_amount: Number(booking.total) * 100,
                        },
                        quantity: 1,
                    }],
                mode: 'payment',
                success_url: `${process.env.APP_URL}payment/success?session_id={CHECKOUT_SESSION_ID}&booking_id=${booking._id}`,
                cancel_url: `${process.env.APP_URL}payment/cancel?session_id={CHECKOUT_SESSION_ID}&booking_id=${booking._id}`,
            });
            await this.notificationService.sendNotification('Tour New Booking', `${booking.tour.name} is booked by ${user.name}`, undefined, booking.vendor._id, "vendor");
            return stripeSession;
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async BookingAvailability(request) {
        try {
            const { vendor_id, booking_type, date, time_slot, tour_id, dates: requested_dates } = request;
            const vendor = await this.userModel.findOne({ _id: vendor_id }).select('available_time_slots start_date end_date dates');
            const bookings = await this.bookingModel.find({ tour: tour_id });
            const requested_date = this.dateTimeFormatter.convertToDate(date);
            const currentDate = new Date();
            if (booking_type === 'multi_day') {
                const pastDates = requested_dates.filter(reqDate => new Date(this.dateTimeFormatter.convertToDate(reqDate)) < currentDate);
                if (pastDates.length) {
                    throw new common_1.HttpException(`Cannot book on past dates: ${pastDates.join(', ')}`, common_1.HttpStatus.BAD_REQUEST);
                }
                const bookedDatesArray = bookings.map(booking => this.dateTimeFormatter.convertToDate(booking.date));
                const overlappingDates = requested_dates.filter(requestedMultiDate => bookedDatesArray.includes(this.dateTimeFormatter.convertToDate(requestedMultiDate)));
                if (overlappingDates.length) {
                    throw new common_1.HttpException(`Tour guide is already booked on the following dates: ${overlappingDates.join(', ')}`, common_1.HttpStatus.BAD_REQUEST);
                }
                const unavailableDates = requested_dates.filter(reqDate => !vendor.dates.includes(this.dateTimeFormatter.convertToDate(reqDate)));
                if (unavailableDates.length) {
                    throw new common_1.HttpException(`Tour guide is not available on the following dates: ${unavailableDates.join(', ')}`, common_1.HttpStatus.BAD_REQUEST);
                }
                return { [booking_type]: vendor.available_time_slots['full_day'] };
            }
            if (new Date(this.dateTimeFormatter.convertToDate(date)) < currentDate) {
                throw new common_1.HttpException(`Cannot book on a past date: ${date}`, common_1.HttpStatus.BAD_REQUEST);
            }
            if (!vendor.dates.includes(this.dateTimeFormatter.convertToDate(date))) {
                throw new common_1.HttpException('Tour guide is not available on this date', common_1.HttpStatus.BAD_REQUEST);
            }
            const bookedDates = new Set(bookings.map(booking => this.dateTimeFormatter.convertToDate(booking.date)));
            const bookedTypes = bookings.some(booking => booking.booking_type === 'full_day' && this.dateTimeFormatter.convertToDate(booking.date) === requested_date);
            if (booking_type === 'full_day' && bookedTypes) {
                throw new common_1.HttpException('Tour guide is already booked on this date', common_1.HttpStatus.BAD_REQUEST);
            }
            else if (booking_type === 'full_day') {
                if (bookedDates.has(requested_date)) {
                    throw new common_1.HttpException('Tour guide is already booked on this date', common_1.HttpStatus.BAD_REQUEST);
                }
                else {
                    return { [booking_type]: vendor.available_time_slots[booking_type] };
                }
            }
            else if (booking_type === 'half_day') {
                if (bookedTypes) {
                    throw new common_1.HttpException('Tour guide is already booked on this date', common_1.HttpStatus.BAD_REQUEST);
                }
                const bookedTimeSlots = bookings
                    .filter(booking => (booking.booking_type === 'half_day' || booking.booking_type === 'hourly_bases') && this.dateTimeFormatter.convertToDate(booking.date) === requested_date)
                    .map(booking => booking.booked_slot);
                const updatedTimeSlots = vendor.available_time_slots[booking_type].filter(slot => {
                    const halfHourSlot = slot.replace(' AM', ':30 AM').replace(' PM', ':30 PM');
                    return !bookedTimeSlots.some((bookedSlot) => this.dateTimeFormatter.isSlotOverlap(slot, bookedSlot) || this.dateTimeFormatter.isSlotOverlap(halfHourSlot, bookedSlot));
                });
                if (updatedTimeSlots.length <= 0) {
                    throw new common_1.HttpException('Tour guide is already booked on this date', common_1.HttpStatus.BAD_REQUEST);
                }
                return { [booking_type]: updatedTimeSlots };
            }
            const bookedSlots = bookings.map(booking => booking.booked_slot);
            const updatedTimeSlots = {};
            let fullDayBooked = false;
            for (const bookingType in vendor.available_time_slots) {
                if (Array.isArray(vendor.available_time_slots[bookingType])) {
                    updatedTimeSlots[bookingType] = vendor.available_time_slots[bookingType].filter(slot => {
                        const isBooked = bookedSlots.includes(slot);
                        if (isBooked) {
                            fullDayBooked = true;
                        }
                        return !isBooked;
                    });
                }
                else {
                    if (!bookedSlots.includes(vendor.available_time_slots[bookingType])) {
                        updatedTimeSlots[bookingType] = vendor.available_time_slots[bookingType];
                    }
                    else {
                        fullDayBooked = true;
                    }
                }
            }
            if (fullDayBooked) {
                delete updatedTimeSlots['full_day'];
            }
            return updatedTimeSlots;
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async UpdatedBookingAvailability(request) {
        try {
            const { vendor_id, booking_type, date, time_slot, tour_id } = request;
            const vendor = await this.userModel.findOne({ _id: vendor_id }).select('available_time_slots start_date end_date');
            const bookings = await this.bookingModel.find({ tour: tour_id });
            const requested_date = this.dateTimeFormatter.convertToDate(date);
            if (requested_date >= vendor.start_date && requested_date <= vendor.end_date) {
                const bookedDates = new Set(bookings.map(booking => this.dateTimeFormatter.convertToDate(booking.date)));
                const bookedTypes = bookings.some(booking => booking.booking_type === 'full_day' && this.dateTimeFormatter.convertToDate(booking.date) === requested_date);
                if (booking_type === 'full_day' && bookedTypes) {
                    throw new common_1.HttpException('Tour guide is already booked on this date', common_1.HttpStatus.BAD_REQUEST);
                }
                else if (booking_type === 'full_day') {
                    if (bookedDates.has(requested_date)) {
                        throw new common_1.HttpException('Tour guide is already booked on this date', common_1.HttpStatus.BAD_REQUEST);
                    }
                    else {
                        return { [booking_type]: vendor.available_time_slots[booking_type] };
                    }
                }
                else if (booking_type === 'half_day') {
                    if (bookedTypes) {
                        throw new common_1.HttpException('Tour guide is already booked on this date', common_1.HttpStatus.BAD_REQUEST);
                    }
                    const bookedTimeSlots = bookings
                        .filter(booking => (booking.booking_type === 'half_day') && this.dateTimeFormatter.convertToDate(booking.date) === requested_date)
                        .map(booking => booking.booked_slot);
                    const updatedTimeSlots = vendor.available_time_slots[booking_type].filter(slot => {
                        const halfHourSlot = slot.replace(' AM', ':30 AM').replace(' PM', ':30 PM');
                        return !bookedTimeSlots.some((bookedSlot) => this.dateTimeFormatter.isSlotOverlap(slot, bookedSlot) || this.dateTimeFormatter.isSlotOverlap(halfHourSlot, bookedSlot));
                    });
                    if (updatedTimeSlots.length <= 0) {
                        throw new common_1.HttpException('Tour guide is already booked on this date', common_1.HttpStatus.BAD_REQUEST);
                    }
                    return { [booking_type]: updatedTimeSlots };
                }
                const bookedSlots = bookings.map(booking => booking.booked_slot);
                const updatedTimeSlots = {};
                let fullDayBooked = false;
                for (const bookingType in vendor.available_time_slots) {
                    if (Array.isArray(vendor.available_time_slots[bookingType])) {
                        updatedTimeSlots[bookingType] = vendor.available_time_slots[bookingType].filter(slot => {
                            const isBooked = bookedSlots.includes(slot);
                            if (isBooked) {
                                fullDayBooked = true;
                            }
                            return !isBooked;
                        });
                    }
                    else {
                        if (!bookedSlots.includes(vendor.available_time_slots[bookingType])) {
                            updatedTimeSlots[bookingType] = vendor.available_time_slots[bookingType];
                        }
                        else {
                            fullDayBooked = true;
                        }
                    }
                }
                if (fullDayBooked) {
                    delete updatedTimeSlots['full_day'];
                }
                return updatedTimeSlots;
            }
            else {
                throw new common_1.HttpException('Tour guide is not available on this date', common_1.HttpStatus.BAD_REQUEST);
            }
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async AvailableDates(tour_id) {
        try {
            const tour = await this.tourModel.findOne({ _id: tour_id }).populate('vendor');
            const bookings = await this.bookingModel.find({ vendor: tour.vendor._id, booking_request_status: { $ne: 'rejected' } });
            const bookedFullDayDates = bookings
                .filter(booking => booking.booking_type === 'full_day')
                .map(booking => booking.date.toISOString().split('T')[0]);
            const bookedMultiDayDates = bookings
                .filter(booking => booking.booking_type === 'multi_day')
                .reduce((acc, booking) => {
                booking.dates.forEach(date => acc.push(date.toISOString().split('T')[0]));
                return acc;
            }, []);
            const allBookedDates = [...bookedFullDayDates, ...bookedMultiDayDates];
            const halfDayBookingCounts = bookings
                .filter(booking => booking.booking_type === 'half_day')
                .reduce((acc, booking) => {
                const dateStr = booking.date.toISOString().split('T')[0];
                acc[dateStr] = (acc[dateStr] || 0) + 1;
                return acc;
            }, {});
            const availableFullDayDates = tour.vendor.dates.filter(date => {
                return !allBookedDates.includes(date) && (halfDayBookingCounts[date] || 0) !== 1;
            });
            const availableHalfDayDates = tour.vendor.dates.filter(date => {
                return !allBookedDates.includes(date) && (halfDayBookingCounts[date] || 0) < 2;
            });
            return { full_day: availableFullDayDates, half_day: availableHalfDayDates };
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
BookingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)('Booking')),
    __param(1, (0, mongoose_2.InjectModel)('Tour')),
    __param(2, (0, mongoose_2.InjectModel)('Pricing')),
    __param(3, (0, mongoose_2.InjectModel)('User')),
    __param(4, (0, common_1.Inject)('STRIPE')),
    __param(5, (0, mongoose_2.InjectModel)('Feedback')),
    __metadata("design:paramtypes", [mongoose_1.Model,
        mongoose_1.Model,
        mongoose_1.Model,
        mongoose_1.Model,
        stripe_1.Stripe,
        mongoose_1.Model,
        DateTimeFormatter_service_1.DateTimeFormatter,
        Email_service_1.EmailService,
        notification_service_1.NotificationService])
], BookingService);
exports.BookingService = BookingService;
//# sourceMappingURL=booking.service.js.map