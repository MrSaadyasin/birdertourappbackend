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
exports.PaymentService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const mongoose_2 = require("@nestjs/mongoose");
const stripe_1 = require("stripe");
const axios_1 = require("axios");
const moment = require("moment");
const Email_service_1 = require("../../Utils/Email.service");
const notification_service_1 = require("../notification/notification.service");
let PaymentService = class PaymentService {
    constructor(stripeClient, bookingModel, paymentModel, userModel, tourModel, pricingModle, vendorPaymentModel, notificationService, emailService) {
        this.stripeClient = stripeClient;
        this.bookingModel = bookingModel;
        this.paymentModel = paymentModel;
        this.userModel = userModel;
        this.tourModel = tourModel;
        this.pricingModle = pricingModle;
        this.vendorPaymentModel = vendorPaymentModel;
        this.notificationService = notificationService;
        this.emailService = emailService;
    }
    async createBooking(paymentDto) {
        try {
            const { stripe_session_id, booking_id } = paymentDto;
            const session = await this.stripeClient.checkout.sessions.retrieve(stripe_session_id, {
                expand: ['payment_intent'],
            });
            const booking = await this.bookingModel.findOneAndUpdate({ _id: booking_id }, { $set: { payment_status: session.payment_status } }, { new: true }).populate('vendor', 'name email').populate('user', 'name email').populate('tour');
            await this.paymentModel.create({
                stripe_session_id: stripe_session_id,
                booking: booking_id
            });
            if (session.payment_status === 'paid') {
                const admin = await this.userModel.findOne({ role: 'admin' }).select('email name');
                await this.emailService.sentUserTourPayment(booking, admin, `User Tour Payment`);
            }
            return;
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async connectWithStripe(req) {
        try {
            const vendor_id = req['user'].id;
            const vendor = await this.userModel.findOne({ _id: vendor_id });
            if (vendor.stripe_user_id) {
                throw new common_1.HttpException('Already connected with stripe ', common_1.HttpStatus.BAD_REQUEST);
            }
            let connect_client_id = process.env.STRIPE_CONNECT_CLIENT_ID;
            let redirect_url = process.env.STRIPE_CONNECT_REDIRECT_URL;
            return `https://connect.stripe.com/oauth/v2/authorize?response_type=code&client_id=${connect_client_id}&scope=read_write&redirect_uri=${redirect_url}`;
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async createConnectAccount(code, req) {
        try {
            const vendor_id = req['user'].id;
            const response = await axios_1.default.post('https://connect.stripe.com/oauth/token', {
                client_secret: process.env.STRIPE_SECRET_KEY,
                code,
                grant_type: 'authorization_code',
            });
            return await this.userModel.findOneAndUpdate({ _id: vendor_id }, { stripe_user_id: response.data.stripe_user_id }, { new: true });
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async paymentRequest(body, req) {
        try {
            const vendor = req['user'];
            const vendorProfile = await this.userModel.findOne({ _id: vendor.id });
            if (!vendorProfile.stripe_user_id) {
                throw new common_1.HttpException('Please go to profile and connect to stripe account.', common_1.HttpStatus.BAD_REQUEST);
            }
            const startDate = moment().startOf('day');
            const { booking_id } = body;
            const booking = await this.bookingModel.findOneAndUpdate({ _id: booking_id, vendor: vendor.id, payment_status: 'paid', request_status: 'unpaid', date: { $lte: startDate.toDate() } }, { request_status: 'pending' }, { new: true }).populate('user', 'name email profile_image').populate('tour').populate('vendor', 'name email');
            if (booking) {
                const pricing = await this.pricingModle.findOne({ tour: booking['tour']._id });
                booking['tour']['pricing'] = pricing;
                const admin = await this.userModel.findOne({ role: 'admin' }).select('email name');
                await this.emailService.vendorPaymentRequest(booking, admin, `Vendor Payment Request`);
                await this.notificationService.sendNotification('Payment Request', `${vendor.name} is requested for payment`, undefined, vendor.id);
                return booking;
            }
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async paymentTourRequest() {
        let bookings = await this.bookingModel.find({ payment_status: 'paid', request_status: 'pending' }).populate('vendor', 'name email profile_image badge stripe_user_id').populate('tour');
        for (let booking of bookings) {
            const pricing = await this.pricingModle.findOne({ tour: booking.tour._id });
            booking.tour['pricing'] = pricing;
        }
        return bookings;
    }
    async sendVendorPayment(body) {
        try {
            const { booking_id, stripe_user_id } = body;
            const startDate = moment().startOf('day');
            const booking = await this.bookingModel.findOne({ _id: booking_id, request_status: 'pending', payment_status: 'paid', date: { $lte: startDate.toDate() } });
            const vendorPayment = await this.vendorPaymentModel.findOne({ booking: booking._id, request_status: 'paid' });
            if (vendorPayment) {
                throw new common_1.HttpException('Already Paid', common_1.HttpStatus.BAD_REQUEST);
            }
            const tour = await this.tourModel.findOne({ _id: booking.tour }).select('name total');
            const sumAmmount = Math.round(booking.total * 0.98 * 100);
            if (sumAmmount > 0) {
                const stripeSession = await this.stripeClient.checkout.sessions.create({
                    payment_method_types: ['card'],
                    line_items: [{
                            price_data: {
                                currency: 'usd',
                                product_data: {
                                    name: tour.name,
                                },
                                unit_amount: sumAmmount,
                            },
                            quantity: 1,
                        }],
                    mode: 'payment',
                    success_url: `${process.env.APP_VENDOR_URL}admin/payments/success?session_id={CHECKOUT_SESSION_ID}`,
                    cancel_url: `${process.env.APP_VENDOR_URL}admin/payments/cancel?session_id={CHECKOUT_SESSION_ID}`,
                    payment_intent_data: {
                        transfer_data: {
                            destination: stripe_user_id,
                        },
                    },
                });
                const totalAmount = Math.round(booking.total * 0.98);
                await this.vendorPaymentModel.findOneAndUpdate({ booking: booking_id }, {
                    vendor: booking.vendor,
                    booking: booking_id,
                    tour: booking.tour,
                    total: totalAmount
                }, { upsert: true });
                return stripeSession;
            }
            else {
                throw new common_1.HttpException('insufficient Ammount', common_1.HttpStatus.BAD_REQUEST);
            }
        }
        catch (error) {
            console.log(error.message);
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async updateVendorPaymentStatus(vendorPayment) {
        try {
            const { stripe_session_id, booking_id } = vendorPayment;
            const session = await this.stripeClient.checkout.sessions.retrieve(stripe_session_id, {
                expand: ['payment_intent'],
            });
            const booking = await this.bookingModel.findOneAndUpdate({ _id: booking_id }, { $set: { request_status: session.payment_status } }, { new: true }).populate('user', 'name email profile_image').populate('tour').populate('vendor', 'name email');
            await this.vendorPaymentModel.findOneAndUpdate({ booking: booking_id }, { $set: { payment_status: session.payment_status, stripe_session_id: stripe_session_id } });
            if (session.payment_status === 'paid') {
                const vendor = booking.vendor._id.toString();
                const admin = await this.userModel.findOne({ role: 'admin' }).select('email name');
                await this.emailService.vendorPaymentReceived(booking, admin, `User Tour Payment`);
                await this.notificationService.sendNotification('Payment Received', `You received payment from admin`, undefined, vendor, 'vendor');
            }
            return;
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async vendorPaymentHistory(req) {
        try {
            const vendor_id = req['user'].id;
            const history = await this.vendorPaymentModel.find({ vendor: vendor_id, payment_status: 'paid' }).populate('tour', 'name');
            return history;
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async vendorPaymentStats(req) {
        try {
            const vendor_id = req['user'].id;
            const vendor = await this.userModel.findOne({ _id: vendor_id }).select('stripe_user_id');
            if (!vendor || !vendor.stripe_user_id) {
                throw new common_1.HttpException('Stripe user not found.', common_1.HttpStatus.BAD_REQUEST);
            }
            const balance = await this.stripeClient.balance.retrieve({
                stripeAccount: vendor.stripe_user_id
            });
            const usdBalance = balance.available.find(b => b.currency === 'usd');
            const currentBalanceUSD = usdBalance ? usdBalance.amount : 0;
            const incoming = await this.bookingModel.aggregate([
                {
                    $match: {
                        vendor: new mongoose_1.default.Types.ObjectId(vendor_id),
                        payment_status: 'paid', request_status: { $in: ['pending', 'unpaid'] }
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: '$total' }
                    }
                }
            ]);
            const withdraw = await this.bookingModel.aggregate([
                {
                    $match: {
                        vendor: new mongoose_1.default.Types.ObjectId(vendor_id),
                        payment_status: 'paid', request_status: 'paid'
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: '$total' }
                    }
                }
            ]);
            const incomingBalance = incoming.length > 0 ? incoming[0].total : 0;
            const totalWithdrawn = withdraw.length > 0 ? withdraw[0].total : 0;
            return {
                incomingBalance,
                totalWithdrawn,
                currentBalance: currentBalanceUSD
            };
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async adminPaymentStats(req) {
        try {
            const balance = await this.stripeClient.balance.retrieve();
            const usdBalance = balance.available.find((balanceObj) => balanceObj.currency === 'usd');
            const availableBalance = usdBalance ? usdBalance.amount / 100 : 0;
            const incoming = await this.bookingModel.aggregate([
                {
                    $match: {
                        payment_status: 'paid', request_status: { $in: ['pending', 'unpaid'] }
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: '$total' }
                    }
                }
            ]);
            const withdraw = await this.bookingModel.aggregate([
                {
                    $match: {
                        payment_status: 'paid', request_status: 'paid'
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: '$total' }
                    }
                }
            ]);
            const incomingBalance = incoming.length > 0 ? incoming[0].total : 0;
            const totalWithdrawn = withdraw.length > 0 ? withdraw[0].total : 0;
            return {
                incomingBalance,
                totalWithdrawn,
                currentBalance: availableBalance
            };
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
PaymentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('STRIPE')),
    __param(1, (0, mongoose_2.InjectModel)('Booking')),
    __param(2, (0, mongoose_2.InjectModel)('Payment')),
    __param(3, (0, mongoose_2.InjectModel)('User')),
    __param(4, (0, mongoose_2.InjectModel)('Tour')),
    __param(5, (0, mongoose_2.InjectModel)('Pricing')),
    __param(6, (0, mongoose_2.InjectModel)('VendorPayment')),
    __metadata("design:paramtypes", [stripe_1.Stripe,
        mongoose_1.Model,
        mongoose_1.Model,
        mongoose_1.Model,
        mongoose_1.Model,
        mongoose_1.Model,
        mongoose_1.Model,
        notification_service_1.NotificationService,
        Email_service_1.EmailService])
], PaymentService);
exports.PaymentService = PaymentService;
//# sourceMappingURL=payment.service.js.map