import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Stripe } from 'stripe';
import { PaymentDto } from 'src/dto/payment.dto';
import { Booking } from 'src/model/booking.model';
import { Payment } from 'src/model/payment.model';
import { User } from 'src/model/user.model';
import axios from 'axios';
import * as moment from 'moment';
import { Tour } from 'src/model/tour.model';
import { VendorPayment } from 'src/model/vendorPayment.model';
import { Pricing } from 'src/model/pricing.model';
import { isEmpty } from 'rxjs';
import { VendorPaymentDTO } from 'src/dto/vendorPayment.dto';
import { EmailService } from 'src/Utils/Email.service';
import { NotificationService } from '../notification/notification.service';





@Injectable()
export class PaymentService {
    constructor(
        @Inject('STRIPE') private readonly stripeClient: Stripe,
        @InjectModel('Booking') private readonly bookingModel: Model<Booking>,
        @InjectModel('Payment') private readonly paymentModel: Model<Payment>,
        @InjectModel('User') private readonly userModel: Model<User>,
        @InjectModel('Tour') private readonly tourModel: Model<Tour>,
        @InjectModel('Pricing') private readonly pricingModle: Model<Pricing>,
        @InjectModel('VendorPayment') private readonly vendorPaymentModel: Model<VendorPayment>,
        private notificationService: NotificationService,
        private emailService: EmailService,
    ) { }


    async createBooking(paymentDto: PaymentDto) {
        try {
            const { stripe_session_id, booking_id } = paymentDto;
            // Fetch the checkout session from Stripe
            const session = await this.stripeClient.checkout.sessions.retrieve(stripe_session_id, {
                expand: ['payment_intent'], // Include the payment_intent data
            });

            const booking = await this.bookingModel.findOneAndUpdate({ _id: booking_id }, { $set: { payment_status: session.payment_status } }, { new: true }).populate('vendor', 'name email').populate('user', 'name email').populate('tour')
            await this.paymentModel.create({
                stripe_session_id: stripe_session_id,
                booking: booking_id
            })
            if (session.payment_status === 'paid') {
                const admin = await this.userModel.findOne({ role: 'admin' }).select('email name')
                await this.emailService.sentUserTourPayment(booking, admin, `User Tour Payment`)
            }
            return
        } catch (error) {
            throw new HttpException(error, HttpStatus.BAD_REQUEST)

        }
    }


    async connectWithStripe(req: any) {
        try {
            const vendor_id = req['user'].id
            const vendor = await this.userModel.findOne({ _id: vendor_id })
            if (vendor.stripe_user_id) {
                throw new HttpException('Already connected with stripe ', HttpStatus.BAD_REQUEST);

            }
            let connect_client_id = process.env.STRIPE_CONNECT_CLIENT_ID
            let redirect_url = process.env.STRIPE_CONNECT_REDIRECT_URL
            return `https://connect.stripe.com/oauth/v2/authorize?response_type=code&client_id=${connect_client_id}&scope=read_write&redirect_uri=${redirect_url}`
        } catch (error) {
            throw new HttpException(error, HttpStatus.BAD_REQUEST)
        }
    }

    async createConnectAccount(code: string, req: any) {
        try {
            const vendor_id = req['user'].id
            const response = await axios.post('https://connect.stripe.com/oauth/token', {
                client_secret: process.env.STRIPE_SECRET_KEY,
                code,
                grant_type: 'authorization_code',
            });
            // Save the connected account ID (response.data.stripe_user_id) in your database
            // Also save the response.data.access_token if you need to make authenticated requests on behalf of the connected account
            return await this.userModel.findOneAndUpdate({ _id: vendor_id }, { stripe_user_id: response.data.stripe_user_id }, { new: true })
        } catch (error) {
            throw new HttpException(error, HttpStatus.BAD_REQUEST)
        }

    }
    async paymentRequest(body: any, req: any) {
        try {
            const vendor = req['user']
            const vendorProfile = await this.userModel.findOne({ _id: vendor.id })
            if (!vendorProfile.stripe_user_id) {
                throw new HttpException('Please go to profile and connect to stripe account.', HttpStatus.BAD_REQUEST);

            }
            const startDate = moment().startOf('day')
            const { booking_id } = body
            const booking = await this.bookingModel.findOneAndUpdate({ _id: booking_id, vendor: vendor.id, payment_status: 'paid', request_status: 'unpaid', date: { $lte: startDate.toDate() } }, { request_status: 'pending' }, { new: true }).populate('user', 'name email profile_image').populate('tour').populate('vendor', 'name email')
            if (booking) {
                const pricing = await this.pricingModle.findOne({ tour: booking['tour']._id });
                booking['tour']['pricing'] = pricing
                const admin = await this.userModel.findOne({ role: 'admin' }).select('email name')
                await this.emailService.vendorPaymentRequest(booking, admin, `Vendor Payment Request`)
                await  this.notificationService.sendNotification('Payment Request',`${vendor.name} is requested for payment`, undefined, vendor.id)

                return booking
            }
        } catch (error) {
            throw new HttpException(error, HttpStatus.BAD_REQUEST)
        }


    }
    async paymentTourRequest() {
        let bookings = await this.bookingModel.find({ payment_status: 'paid', request_status: 'pending' }).populate('vendor', 'name email profile_image badge stripe_user_id').populate('tour')
        for (let booking of bookings) {
            const pricing = await this.pricingModle.findOne({ tour: booking.tour._id });
            booking.tour['pricing'] = pricing;
        }
        return bookings;

    }

    async sendVendorPayment(body: any) {
        try {
            const { booking_id, stripe_user_id } = body
            const startDate = moment().startOf('day')
            const booking = await this.bookingModel.findOne({ _id: booking_id, request_status: 'pending', payment_status: 'paid', date: { $lte: startDate.toDate() } })
            const vendorPayment = await this.vendorPaymentModel.findOne({ booking: booking._id, request_status: 'paid' })
            if (vendorPayment) {
                throw new HttpException('Already Paid', HttpStatus.BAD_REQUEST)
            }
            const tour = await this.tourModel.findOne({ _id: booking.tour }).select('name total')
            const sumAmmount = Math.round(booking.total * 0.98 * 100);    // 1 - 0.02 = 0.98   it deduct the 2 percent of total
            if (sumAmmount > 0) {
                const stripeSession = await this.stripeClient.checkout.sessions.create({
                    payment_method_types: ['card'],
                    line_items: [{
                        price_data: {
                            currency: 'usd',
                            product_data: {
                                name: tour.name,
                            },
                            unit_amount: sumAmmount, // Stripe expects the amount in cents
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
                })
                const totalAmount = Math.round(booking.total * 0.98)
                 await this.vendorPaymentModel.findOneAndUpdate({ booking: booking_id }, {
                    vendor: booking.vendor,
                    booking: booking_id,
                    tour: booking.tour,
                    total: totalAmount
                }, { upsert: true })
                // await this.notificationService.sendNotification('Tour New Booking', `${tour.name} is booked by ${user.name}`, undefined, vendor_id, "vendor")
                return stripeSession

            } else {
                throw new HttpException('insufficient Ammount', HttpStatus.BAD_REQUEST)
            }
        } catch (error) {
            console.log(error.message)
            throw new HttpException(error, HttpStatus.BAD_REQUEST)
        }
    }


    async updateVendorPaymentStatus(vendorPayment: VendorPaymentDTO) {
        try {
            const { stripe_session_id, booking_id } = vendorPayment
            // Fetch the checkout session from Stripe
            const session = await this.stripeClient.checkout.sessions.retrieve(stripe_session_id, {
                expand: ['payment_intent'], // Include the payment_intent data
            });
            const booking = await this.bookingModel.findOneAndUpdate({ _id: booking_id }, { $set: { request_status: session.payment_status } }, { new: true }).populate('user', 'name email profile_image').populate('tour').populate('vendor', 'name email')

            await this.vendorPaymentModel.findOneAndUpdate({ booking: booking_id }, { $set: { payment_status: session.payment_status, stripe_session_id: stripe_session_id } })
            if (session.payment_status === 'paid') {
                const vendor = booking.vendor._id.toString();
                const admin = await this.userModel.findOne({ role: 'admin' }).select('email name')
                await this.emailService.vendorPaymentReceived(booking, admin, `User Tour Payment`)
                await  this.notificationService.sendNotification('Payment Received',`You received payment from admin`, undefined, vendor , 'vendor')
            }

            return
        } catch (error) {
            throw new HttpException(error, HttpStatus.BAD_REQUEST)

        }
    }
    async vendorPaymentHistory(req: any) {
        try {
            const vendor_id = req['user'].id
            const history = await this.vendorPaymentModel.find({ vendor: vendor_id, payment_status: 'paid' }).populate('tour', 'name')
            return history
        } catch (error) {
            throw new HttpException(error, HttpStatus.BAD_REQUEST)
        }
    }

    async vendorPaymentStats(req: any) {
        try {
            const vendor_id = req['user'].id
            const vendor = await this.userModel.findOne({ _id: vendor_id }).select('stripe_user_id')
            // Check if vendor and stripe_user_id exist
            if (!vendor || !vendor.stripe_user_id) {
                throw new HttpException('Stripe user not found.', HttpStatus.BAD_REQUEST);
            }
            const balance = await this.stripeClient.balance.retrieve({
                stripeAccount: vendor.stripe_user_id
            });
            const usdBalance = balance.available.find(b => b.currency === 'usd');
            const currentBalanceUSD = usdBalance ? usdBalance.amount : 0;

            // // Fetch transfers (payouts) to determine total withdrawn amount
            // const transfers = await this.stripeClient.transfers.list({
            //     stripeAccount: vendor.stripe_user_id,
            //     // You might want to add more filters, for example to only consider successful transfers, etc.
            // });

            // const totalWithdraw = transfers.data.reduce((acc, transfer) => acc + transfer.amount, 0);
            const incoming = await this.bookingModel.aggregate([
                {
                    $match: {
                        vendor: new mongoose.Types.ObjectId(vendor_id),
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
            const withdraw  = await this.bookingModel.aggregate([
                {
                    $match: {
                        vendor: new mongoose.Types.ObjectId(vendor_id),
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
            // const withdraw  = await this.bookingModel.aggregate([
            //     {
            //         $match: {
            //             vendor: new mongoose.Types.ObjectId(vendor_id),
            //             payment_status: 'paid', request_status: 'paid'
            //         }
            //     },
            //     {
            //         $group: {
            //             _id: null,
            //             total: { $sum: '$total' }
            //         }
            //     }

            // ]);
            const incomingBalance = incoming.length > 0 ? incoming[0].total : 0;
            const totalWithdrawn = withdraw.length > 0 ? withdraw[0].total : 0;
            return {
                incomingBalance,
                totalWithdrawn,
                currentBalance: currentBalanceUSD
            }
        } catch (error) {
            throw new HttpException(error, HttpStatus.BAD_REQUEST)
        }
    }


    async adminPaymentStats(req: any) {
        try {
            const balance = await this.stripeClient.balance.retrieve();
            // Find the USD balance
            const usdBalance = balance.available.find((balanceObj) => balanceObj.currency === 'usd');
            // Calculate the available balance in USD dollars
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
            const withdraw  = await this.bookingModel.aggregate([
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
            }
        } catch (error) {
            throw new HttpException(error, HttpStatus.BAD_REQUEST)
        }
    }


}


