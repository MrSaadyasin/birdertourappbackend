import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron } from '@nestjs/schedule';
import * as moment from 'moment';
import { Model } from 'mongoose';
import { EmailService } from 'src/Utils/Email.service';
import { Booking } from 'src/model/booking.model';
import { User } from 'src/model/user.model';


@Injectable()
export class CronService {
    constructor(@InjectModel('Booking') private readonly bookingModel: Model<Booking>,
        @InjectModel('User') private readonly userModel: Model<User>,
        private emailService: EmailService,
    ) { }

    //  @Cron('*/10 * * * * *')    // every 10 second
    @Cron('0 0-23/12 * * *')      // every 12 hours
    async vendorFeedBack() {
        try {
            const startDate = moment().startOf('day')
            await this.bookingModel.updateMany(
                {
                    payment_status: 'paid',
                    feedback_status: 'pending',
                    is_reminder: false,
                    date: { $lte: startDate.toDate() }
                },
                { $set: { feedback_status: 'inProgress' } }
            );
            const toUpdateBookings = await this.bookingModel.find({
                payment_status: 'paid',
                feedback_status: 'inProgress',
                is_reminder: false,
                date: { $lte: startDate.toDate() }
            }).populate('user', 'name email').populate('vendor', 'name email role').populate('tour', 'name')

            await this.bookingModel.updateMany(
                {
                    payment_status: 'paid',
                    feedback_status: 'inProgress',
                    is_reminder: false,
                    date: { $lte: startDate.toDate() }
                },
                { $set: { is_reminder: true } }
            );
            if (toUpdateBookings) {

                await this.emailService.vendorFeedbackTour(toUpdateBookings, `Tour Feedback`)
                await this.emailService.userFeedbackTour(toUpdateBookings, 'Tour Feedback')
            }
            console.log('feedback mail sent using cron')
        } catch (error) {
            throw new HttpException(error, HttpStatus.BAD_REQUEST)
        }

    }




    @Cron('0 0 1 * *')     // should work after one month
    async addBadge() {
        try {
            const startDate = moment().startOf('day')
            // let bookings = await this.bookingModel.find({ payment_status: 'paid', date: { $lte: startDate.toDate() } })
            let topVendorBooking = await this.bookingModel.aggregate([
                { $match: { payment_status: 'paid', date: { $lte: startDate.toDate() } } },
                {
                    $group: {
                        _id: "$vendor",
                        total: { $sum: 1 }
                    }
                },
                {
                    $sort: { total: -1 }
                },
                {
                    $limit: 1
                }
            ]);
            const vendor_id = topVendorBooking[0]._id
            await this.userModel.updateMany(
                {},
                { badge: false }
            );
            await this.userModel.findOneAndUpdate({ _id: vendor_id },
                { badge: true },
            )

            console.log('badge updated successfully using cron')
        } catch (error) {
            throw new HttpException(error, HttpStatus.BAD_REQUEST)
        }

    }


    @Cron('0 0 * * *')  // after 24h
    // @Cron('*/15 * * * * *')    // every 10 second
    async upCommingVendorTourReminder() {
        try {
            const startDate = moment().add(1, 'day').startOf('day'); // Start of next day
            const endDate = moment().add(1, 'day').endOf('day');
            const upcomingBookings = await this.bookingModel.find({ payment_status: 'paid', date: { $gte: startDate.toDate(), $lte: endDate.toDate() } }).populate('user', 'name email').populate('tour').populate('vendor', 'name email')
            for (const upcommingBooking of upcomingBookings) {
                await this.emailService.upCommingVendorTourReminder(upcommingBooking, `Up-Comming Tour Reminder`)
            }
            console.log('upcomming vendor tours reminder sent using cron')
        } catch (error) {
            throw new HttpException(error, HttpStatus.BAD_REQUEST)
        }

    }


    @Cron('0 0 * * *')  // after 24h
    // @Cron('*/15 * * * * *')    // every 10 second
    async upCommingUserTourReminder() {
        try {
            const startDate = moment().add(1, 'day').startOf('day'); // Start of next day
            const endDate = moment().add(1, 'day').endOf('day');
            const upcomingBookings = await this.bookingModel.find({ payment_status: 'paid', date: { $gte: startDate.toDate(), $lte: endDate.toDate() } }).populate('user', 'name email').populate('tour').populate('vendor', 'name email')
            if (upcomingBookings) {
                for (const upcommingBooking of upcomingBookings) {
                    await this.emailService.upCommingUserTourReminder(upcommingBooking, `Up-Comming Tour Reminder`)
                }
            }

            console.log('upcomming user tours reminder sent using cron')
        } catch (error) {
            throw new HttpException(error, HttpStatus.BAD_REQUEST)
        }

    }
}