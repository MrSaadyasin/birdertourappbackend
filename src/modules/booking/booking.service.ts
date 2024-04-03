import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { BookingDTO } from 'src/dto/booking.dto';
import { Tour } from 'src/model/tour.model';
import { Booking } from 'src/model/booking.model';
import { Pricing } from 'src/model/pricing.model';
import { Stripe } from 'stripe';
import { User } from 'src/model/user.model';
import { DateTimeFormatter } from 'src/Utils/DateTimeFormatter.service';
import * as moment from 'moment';
import { NotificationService } from '../notification/notification.service';
import { EmailService } from 'src/Utils/Email.service';
import { FeedBack } from 'src/model/feedback.model';




@Injectable()
export class BookingService {
    constructor(@InjectModel('Booking') private readonly bookingModel: Model<Booking>,
        @InjectModel('Tour') private readonly tourModel: Model<Tour>,
        @InjectModel('Pricing') private readonly pricingModle: Model<Pricing>,
        @InjectModel('User') private readonly userModel: Model<User>,
        @Inject('STRIPE') private readonly stripeClient: Stripe,
        @InjectModel('Feedback') private readonly feedBackModel: Model<FeedBack>,
        private dateTimeFormatter: DateTimeFormatter,
        private readonly emailService: EmailService,
        private notificationService: NotificationService) { }

    async AllBookings() {
        return await this.bookingModel.find()
    }
    async UpComingUserBookings(req: any) {
        try {
            const user_id = req['user'].id
            const startDate = moment().startOf('day')
            let upcomingBookings = await this.bookingModel.find({ user: user_id, payment_status: 'paid',
            $or: [
                { date: { $gte: startDate } }, // Condition for the 'date' field
                {
                    $and: [
                        { dates: { $ne: [] } }, // Ensure 'dates' array is not empty
                        { dates: { $elemMatch: { $gte: startDate } } } // Condition for the 'dates' array field
                    ]
                }
            ]
        }).populate('vendor', 'name email profile_image badge').populate('tour')
                // .sort({ date: 1 })
                // .limit(5)
                .lean()
            for (let booking of upcomingBookings) {
                const pricing = await this.pricingModle.findOne({ tour: booking.tour._id });
                booking.tour['pricing'] = pricing;
            }
            return upcomingBookings;
        } catch (error) {
            throw new HttpException(error, HttpStatus.BAD_REQUEST)
        }

    }
    async PendingUserBookings(req: any) {
        try {
            const user_id = req['user'].id
           
            let pendingBookings = await this.bookingModel.find({ user: user_id, payment_status: 'unpaid',booking_request_status: { $ne: 'rejected' } }).populate('vendor', 'name email profile_image badge').populate('tour')
                // .sort({ date: 1 })
                // .limit(5)
                .lean()
            for (let booking of pendingBookings) {
                const pricing = await this.pricingModle.findOne({ tour: booking.tour._id });
                booking.tour['pricing'] = pricing;
            }
            return pendingBookings;
        } catch (error) {
            throw new HttpException(error, HttpStatus.BAD_REQUEST)
        }

    }
    async RejectedUserBookings(req: any) {
        try {
            const user_id = req['user'].id
            let rejectedBookings = await this.bookingModel.find({ user: user_id, payment_status: 'unpaid',booking_request_status: 'rejected' }).populate('vendor', 'name email profile_image badge').populate('tour')
                // .sort({ date: 1 })
                // .limit(5)
                .lean()
            for (let booking of rejectedBookings) {
                const pricing = await this.pricingModle.findOne({ tour: booking.tour._id });
                booking.tour['pricing'] = pricing;
            }
            return rejectedBookings;
        } catch (error) {
            throw new HttpException(error, HttpStatus.BAD_REQUEST)
        }

    }
    async UserBookingsHistory(req: any) {
        try {
            const user_id = req['user'].id
            const startDate = moment().startOf('day')
            let upcomingBookings = await this.bookingModel.find({ user: user_id,
                 $or: [
                    { date: { $lte: startDate } }, // Condition for the 'date' field
                    {
                        $and: [
                            { dates: { $ne: [] } }, // Ensure 'dates' array is not empty
                            { dates: { $elemMatch: { $lte: startDate } } } // Condition for the 'dates' array field
                        ]
                    }
                ]
                }).populate('vendor', 'name email profile_image badge').populate('tour')
                .sort({ date: 1 })
                // .limit(5)
                .lean()
            for (let booking of upcomingBookings) {
                const pricing = await this.pricingModle.findOne({ tour: booking.tour._id });
                booking.tour['pricing'] = pricing;
            }
            return upcomingBookings;
        } catch (error) {
            throw new HttpException(error, HttpStatus.BAD_REQUEST)
        }

    }

    async UpComingVendorBookings(req: any) {
        try {
            const vendor_id = req['user'].id
            const startDate = moment().startOf('day')
            // let upcomingBookings = await this.bookingModel.find({ vendor: vendor_id, payment_status: 'paid', date: { $gte: startDate.toDate() } }).populate('user', 'name email profile_image').populate('tour')
            let upcomingBookings = await this.bookingModel.find({ vendor: vendor_id, payment_status: 'paid', 
                 booking_request_status: 'approved',
                 $or: [
                    { date: { $gte: startDate } }, // Condition for the 'date' field
                    {
                        $and: [
                            { dates: { $ne: [] } }, // Ensure 'dates' array is not empty
                            { dates: { $elemMatch: { $gte: startDate } } } // Condition for the 'dates' array field
                        ]
                    }
                ]
                 }).populate('user', 'name email profile_image languages description address documents rating').populate('tour')
                .sort({ updatedAt: 1 })
                // .limit(5)
                .lean()
               
            for (let booking of upcomingBookings) {
                let feedback = await this.feedBackModel.find({user : booking.user._id , type: { $ne: 'user' }}).populate('vendor', 'name email profile_image')
                const pricing = await this.pricingModle.findOne({ tour: booking.tour._id });
                booking.tour['pricing'] = pricing;
                booking.user['feedback'] = feedback
            }
            return upcomingBookings;
        } catch (error) {
            throw new HttpException(error, HttpStatus.BAD_REQUEST)
        }

    }
    async RequestedVendorBookings(req: any){
        try {
            const vendor_id = req['user'].id
            const startDate = moment().startOf('day')
            let requestedBookings = await this.bookingModel.find({ vendor: vendor_id, booking_request_status: 'pending',   $or: [
                { date: { $gte: startDate } }, // Condition for the 'date' field
                {
                    $and: [
                        { dates: { $ne: [] } }, // Ensure 'dates' array is not empty
                        { dates: { $elemMatch: { $gte: startDate } } } // Condition for the 'dates' array field
                    ]
                }
            ] }).populate('user', 'name email profile_image languages description address documents rating').populate('tour')
                .sort({ updatedAt: 1 })
                .lean()
            for (let booking of requestedBookings) {
                let feedback = await this.feedBackModel.find({user : booking.user._id , type: { $ne: 'user' }}).populate('vendor', 'name email profile_image')
                const pricing = await this.pricingModle.findOne({ tour: booking.tour._id });
                booking.tour['pricing'] = pricing;
                booking.user['feedback'] = feedback
            }
            return requestedBookings;
        } catch (error) {
            throw new HttpException(error, HttpStatus.BAD_REQUEST)
        }
    }
    async UpdateRequestedBookingStatus(req:any){
        try {
             const vendor_id = req['user'].id
             const {booking_id, booking_request_reason,booking_request_status} = req.body
             const booking = await this.bookingModel.findOneAndUpdate(
                { vendor: vendor_id, _id: booking_id },
                { $set: { booking_request_status: booking_request_status, booking_request_reason: booking_request_reason } },
                { new: true } // this option will return the updated document
              ).populate('tour').populate('vendor', 'name');

              const user = await this.userModel.findOne({_id : booking.user})
              if(booking.booking_request_status === 'approved'){
                const url = `${process.env.APP_URL}bookings`
                await this.emailService.approveTourBookingRequestStatus((user.email as string),(user?.name as string), (booking.tour as any).name,(booking.vendor as any).name, url,booking.date,booking.dates, `Approve Booking Request`)
                       console.log('Email sent successfully')
                return 
              } else if (booking.booking_request_status === 'rejected') {
            //    await this.bookingModel.deleteOne( { _id : booking._id} )
                await this.emailService.rejectedTourBookingRequestStatus((user.email as string),(user?.name as string), booking_request_reason,(booking.tour as any).name,(booking.vendor as any).name, `Rejected Booking Request`)
                
              }
            
             return booking 
            
        } catch (error) {
            throw new HttpException(error, HttpStatus.BAD_REQUEST)  
        }
    }
    async VendorBookingsHistory(req: any) {
        try {
            const vendor_id = req['user'].id
            const startDate = moment().startOf('day')
            let upcomingBookings = await this.bookingModel.find({ vendor: vendor_id, payment_status: 'paid', date: { $lte: startDate.toDate() } }).populate('user', 'name email profile_image languages description address documents rating').populate('tour')
                .sort({ date: 1 })
                // .limit(5)
                .lean()
            for (let booking of upcomingBookings) {
                let feedback = await this.feedBackModel.find({user : booking.user._id , type: { $ne: 'user' }}).populate('vendor', 'name email profile_image')
                const pricing = await this.pricingModle.findOne({ tour: booking.tour._id });
                booking.tour['pricing'] = pricing;
                booking.user['feedback'] = feedback

            }
            return upcomingBookings;
        } catch (error) {
            throw new HttpException(error, HttpStatus.BAD_REQUEST)
        }

    }


    async VendorBookingStats(req: any) {
        try {
            const vendor_id = req['user'].id
            const startDate = moment().startOf('day')

            // const totalCompletedTours = (await this.tourModel.find({ status: 'approved', vendor: vendor_id, updatedAt: { $lte: startDate.toDate() } })).length
            const completedTourCount = await this.bookingModel.aggregate([
                {
                  $match: {
                    vendor: new mongoose.Types.ObjectId(vendor_id),
                    payment_status: 'paid',
                    date: { $lte: startDate.toDate() }
                  }
                },
                {
                  $group: {
                    _id: "$tour",  // Assuming the field name storing tour id is 'tour_id'
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
            const upComingsTours = (await this.bookingModel.find({ vendor: vendor_id, payment_status: 'paid', date: { $gte: startDate.toDate() } })).length
            const vendorObjectId = new mongoose.Types.ObjectId(vendor_id)   // match is not accept the string in pipeline so first we convent this in object is
            const totalEarningQuery = await this.bookingModel.aggregate([
                {
                    $match: {
                        vendor: vendorObjectId,
                        payment_status: 'paid',
                        request_status : 'paid'
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
            }
        } catch (error) {
            throw new HttpException(error, HttpStatus.BAD_REQUEST)
        }

    }


    async BookTour(body: BookingDTO, request: any) {
        try {
           
            const user = request['user']
            const { tour_id, vendor_id, extra_person, total, date, time_slot, booking_type } = body;
            

            const vendor = await this.userModel.findOne({ _id: vendor_id }).select('name email start_date start_time end_date end_time badge booking_request')
            let requested_time_slot = this.dateTimeFormatter.processTimeSlot(time_slot)

            const tour = await this.tourModel.findOne({ _id: tour_id })
            const bookingObject = {
                user: user.id,
                vendor: vendor_id,
                tour: tour_id,
                extra_person: extra_person,
                total: total,
                booking_type: booking_type,
                // date: requested_date,
                date: (booking_type === 'half_day' || booking_type === 'full_day') ? date : "",
                dates : booking_type === 'multi_day' ?  JSON.parse(date as any) : [],
                start_time: requested_time_slot.startTime,
                end_time: requested_time_slot.endTime,
                booked_slot: time_slot,
                booking_request_status : vendor.booking_request === 'requested' ? 'pending' : 'approved'

            }
       
            const booking = await new this.bookingModel(bookingObject).save()
            //Create a Stripe Checkout Session for the booking
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
                                images : ['https://dashboard.earthbirder.com/_next/static/media/logo.0830fd2c.svg']
                            },
                            unit_amount: Number(total) * 100, // Stripe expects the amount in cents
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
                })
                await this.notificationService.sendNotification('Tour New Booking', `${tour.name} is booked by ${user.name}`, undefined, vendor_id, "vendor")
                // Return the Stripe Checkout Session ID along with the booking information
                return {
                    booking,
                    stripeSession: stripeSession
                }
            } else {
                await this.notificationService.sendNotification('Tour New Booking Request', `${tour.name} booking request by ${user.name}`, undefined, vendor_id, "vendor")
                await this.emailService.tourBookingRequestForVendor((vendor?.email as string),(vendor?.name as string),user.name,user.email,tour.name, date , `Tour Booking Request`)
                       console.log('Email sent successfully')
                return  {
                    message: 'Tour booking request sent',
                    booking : false
                }
                
            }

        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
        }
    }

    async BookTourPaymentAfterApprove(body: BookingDTO, request: any) {
        try {
           
            const user = request['user']
            const { booking_id } = body;
            
            const booking = await this.bookingModel.findOne({_id : booking_id, user : user.id, payment_status: 'unpaid', booking_request_status: 'approved'}).populate('tour').populate('vendor')
            //Create a Stripe Checkout Session for the booking
            const tour_name = (booking.tour as any).name
            const guide = (booking.vendor as any).name
                const stripeSession = await this.stripeClient.checkout.sessions.create({
                    payment_method_types: ['card'],
                    line_items: [{
                        price_data: {
                            currency: 'usd',
                            product_data: {
                                name: tour_name,    
                                description: `Guide:${guide}
                                , Slot: ${booking.booked_slot} `
                                ,
                                images : ['https://dashboard.earthbirder.com/_next/static/media/logo.0830fd2c.svg']
                            },
                            unit_amount: Number(booking.total) * 100, // Stripe expects the amount in cents
                        },
                        quantity: 1,
                    }],
                  
                    mode: 'payment',
                    success_url: `${process.env.APP_URL}payment/success?session_id={CHECKOUT_SESSION_ID}&booking_id=${booking._id}`,
                    cancel_url: `${process.env.APP_URL}payment/cancel?session_id={CHECKOUT_SESSION_ID}&booking_id=${booking._id}`,
                })
                await this.notificationService.sendNotification('Tour New Booking', `${(booking.tour as any).name} is booked by ${user.name}`, undefined, (booking.vendor as any)._id, "vendor")
                // Return the Stripe Checkout Session ID along with the booking information
              return stripeSession
        

        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
        }
    }
    async BookingAvailability(request: any) {

        try {
            const { vendor_id, booking_type, date, time_slot, tour_id , dates :requested_dates } = request;
     
            const vendor = await this.userModel.findOne({ _id: vendor_id }).select('available_time_slots start_date end_date dates');
            const bookings = await this.bookingModel.find({ tour: tour_id });
            const requested_date = this.dateTimeFormatter.convertToDate(date);
            const currentDate = new Date(); // get the current date

        
              // Check for multi_day
            if (booking_type === 'multi_day') {
                    // If any requested_dates are before the current date, return an error
            const pastDates = requested_dates.filter(reqDate => new Date(this.dateTimeFormatter.convertToDate(reqDate)) < currentDate);
            if (pastDates.length) {
                throw new HttpException(`Cannot book on past dates: ${pastDates.join(', ')}`, HttpStatus.BAD_REQUEST);
            }
                const bookedDatesArray = bookings.map(booking => this.dateTimeFormatter.convertToDate(booking.date));
                const overlappingDates = requested_dates.filter(requestedMultiDate => bookedDatesArray.includes(this.dateTimeFormatter.convertToDate(requestedMultiDate))); // Find overlapping dates
                
                if (overlappingDates.length) {
                    throw new HttpException(`Tour guide is already booked on the following dates: ${overlappingDates.join(', ')}`, HttpStatus.BAD_REQUEST);
                }
                
                // Check if vendor is available for all the requested_dates
                const unavailableDates = requested_dates.filter(reqDate => !(vendor.dates as string[]).includes(this.dateTimeFormatter.convertToDate(reqDate)));
                if (unavailableDates.length) {
                    throw new HttpException(`Tour guide is not available on the following dates: ${unavailableDates.join(', ')}`, HttpStatus.BAD_REQUEST);
                }
                return { [booking_type]: vendor.available_time_slots['full_day'] }
            }
            if (new Date(this.dateTimeFormatter.convertToDate(date)) < currentDate) {
                throw new HttpException(`Cannot book on a past date: ${date}`, HttpStatus.BAD_REQUEST);
            }
                 // For other booking types
             if (!(vendor.dates as string[]).includes(this.dateTimeFormatter.convertToDate(date))) {
            throw new HttpException('Tour guide is not available on this date', HttpStatus.BAD_REQUEST);
        }
                const bookedDates = new Set(bookings.map(booking => this.dateTimeFormatter.convertToDate(booking.date)));
                const bookedTypes = bookings.some(booking => booking.booking_type === 'full_day' && this.dateTimeFormatter.convertToDate(booking.date) === requested_date);
              
                if (booking_type === 'full_day' && bookedTypes) {
                    throw new HttpException('Tour guide is already booked on this date', HttpStatus.BAD_REQUEST);
                    // Return the full availability for full_day booking type
                } else if (booking_type === 'full_day') {
                    if (bookedDates.has(requested_date)) {
                        throw new HttpException('Tour guide is already booked on this date', HttpStatus.BAD_REQUEST);
                    } else {
                        return { [booking_type]: vendor.available_time_slots[booking_type] }
                    }
                }
                else if (booking_type === 'half_day') {
                    if (bookedTypes) {
                        throw new HttpException('Tour guide is already booked on this date', HttpStatus.BAD_REQUEST);
                    }

                    const bookedTimeSlots = bookings
                        .filter(booking => (booking.booking_type === 'half_day' || booking.booking_type === 'hourly_bases') && this.dateTimeFormatter.convertToDate(booking.date) === requested_date)
                        .map(booking => booking.booked_slot);

                    const updatedTimeSlots = vendor.available_time_slots[booking_type].filter(slot => {
                        const halfHourSlot = slot.replace(' AM', ':30 AM').replace(' PM', ':30 PM');
                        return !bookedTimeSlots.some((bookedSlot: string) => this.dateTimeFormatter.isSlotOverlap(slot, bookedSlot) || this.dateTimeFormatter.isSlotOverlap(halfHourSlot, bookedSlot));
                    });
                    if (updatedTimeSlots.length <= 0) {
                        throw new HttpException('Tour guide is already booked on this date', HttpStatus.BAD_REQUEST);
                    }
                    return { [booking_type]: updatedTimeSlots };


                }

                const bookedSlots = bookings.map(booking => booking.booked_slot);
                const updatedTimeSlots = {};

                let fullDayBooked = false;


                for (const bookingType in vendor.available_time_slots) {
                    if (Array.isArray(vendor.available_time_slots[bookingType])) {
                        // Filter out booked slots for each booking type if it's an array.
                        updatedTimeSlots[bookingType] = vendor.available_time_slots[bookingType].filter(slot => {
                            const isBooked = bookedSlots.includes(slot);
                            if (isBooked) {
                                fullDayBooked = true;
                            }
                            return !isBooked;
                        });
                    } else {
                        // If it's not an array (like 'full_day'), perform a simple check.
                        if (!bookedSlots.includes(vendor.available_time_slots[bookingType])) {
                            updatedTimeSlots[bookingType] = vendor.available_time_slots[bookingType];
                        } else {
                            fullDayBooked = true;
                        }
                    }
                }

                if (fullDayBooked) {
                    delete updatedTimeSlots['full_day'];
                }

                return updatedTimeSlots;
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    async UpdatedBookingAvailability(request: any) {

        try {
            const { vendor_id, booking_type, date, time_slot, tour_id } = request;
            const vendor = await this.userModel.findOne({ _id: vendor_id }).select('available_time_slots start_date end_date');
            const bookings = await this.bookingModel.find({ tour: tour_id });
            const requested_date = this.dateTimeFormatter.convertToDate(date);
            if (requested_date >= vendor.start_date && requested_date <= vendor.end_date) {
                const bookedDates = new Set(bookings.map(booking => this.dateTimeFormatter.convertToDate(booking.date)));
                const bookedTypes = bookings.some(booking => booking.booking_type === 'full_day' && this.dateTimeFormatter.convertToDate(booking.date) === requested_date);
              
                if (booking_type === 'full_day' && bookedTypes) {
                    throw new HttpException('Tour guide is already booked on this date', HttpStatus.BAD_REQUEST);
                    // Return the full availability for full_day booking type
                } else if (booking_type === 'full_day') {
                    if (bookedDates.has(requested_date)) {
                        throw new HttpException('Tour guide is already booked on this date', HttpStatus.BAD_REQUEST);
                    } else {
                        return { [booking_type]: vendor.available_time_slots[booking_type] }
                    }
                }
                else if (booking_type === 'half_day') {
                    if (bookedTypes) {
                        throw new HttpException('Tour guide is already booked on this date', HttpStatus.BAD_REQUEST);
                    }

                    const bookedTimeSlots = bookings
                    // .filter(booking => (booking.booking_type === 'half_day' || booking.booking_type === 'hourly_bases') && this.dateTimeFormatter.convertToDate(booking.date) === requested_date)
                    .filter(booking => (booking.booking_type === 'half_day') && this.dateTimeFormatter.convertToDate(booking.date) === requested_date)
                        .map(booking => booking.booked_slot);

                    const updatedTimeSlots = vendor.available_time_slots[booking_type].filter(slot => {
                        const halfHourSlot = slot.replace(' AM', ':30 AM').replace(' PM', ':30 PM');
                        return !bookedTimeSlots.some((bookedSlot: string) => this.dateTimeFormatter.isSlotOverlap(slot, bookedSlot) || this.dateTimeFormatter.isSlotOverlap(halfHourSlot, bookedSlot));
                    });
                    if (updatedTimeSlots.length <= 0) {
                        throw new HttpException('Tour guide is already booked on this date', HttpStatus.BAD_REQUEST);
                    }
                    return { [booking_type]: updatedTimeSlots };


                }
                const bookedSlots = bookings.map(booking => booking.booked_slot);
                const updatedTimeSlots = {};

                let fullDayBooked = false;


                for (const bookingType in vendor.available_time_slots) {
                    if (Array.isArray(vendor.available_time_slots[bookingType])) {
                        // Filter out booked slots for each booking type if it's an array.
                        updatedTimeSlots[bookingType] = vendor.available_time_slots[bookingType].filter(slot => {
                            const isBooked = bookedSlots.includes(slot);
                            if (isBooked) {
                                fullDayBooked = true;
                            }
                            return !isBooked;
                        });
                    } else {
                        // If it's not an array (like 'full_day'), perform a simple check.
                        if (!bookedSlots.includes(vendor.available_time_slots[bookingType])) {
                            updatedTimeSlots[bookingType] = vendor.available_time_slots[bookingType];
                        } else {
                            fullDayBooked = true;
                        }
                    }
                }

                if (fullDayBooked) {
                    delete updatedTimeSlots['full_day'];
                }

                return updatedTimeSlots;
            } else {
                throw new HttpException('Tour guide is not available on this date', HttpStatus.BAD_REQUEST);
            }
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    async AvailableDates(tour_id: string) {
        try {
            const tour = await this.tourModel.findOne({ _id: tour_id }).populate('vendor');
            const bookings = await this.bookingModel.find({vendor: tour.vendor._id, booking_request_status: { $ne: 'rejected' }});

            // Extract booked dates for full_day bookings
            const bookedFullDayDates = bookings
                .filter(booking => booking.booking_type === 'full_day')
                .map(booking => booking.date.toISOString().split('T')[0]);
    
            // Extract booked dates for multi_day bookings
            const bookedMultiDayDates = bookings
                .filter(booking => booking.booking_type === 'multi_day')
                .reduce((acc, booking) => {
                    booking.dates.forEach(date => acc.push(date.toISOString().split('T')[0]));
                    return acc;
                }, []);
    
            // Merge all booked dates to create a comprehensive list
            const allBookedDates = [...bookedFullDayDates, ...bookedMultiDayDates];
    
            // Create a map to count half_day bookings for each date
            const halfDayBookingCounts = bookings
                .filter(booking => booking.booking_type === 'half_day')
                .reduce((acc, booking) => {
                    const dateStr = booking.date.toISOString().split('T')[0];
                    acc[dateStr] = (acc[dateStr] || 0) + 1;
                    return acc;
                }, {});
    
            // Filter available dates for full_day
            const availableFullDayDates = (tour.vendor as any).dates.filter(date => {
                return !allBookedDates.includes(date) && (halfDayBookingCounts[date] || 0) !== 1;
            });
    
            // Filter available dates for half_day
            const availableHalfDayDates = (tour.vendor as any).dates.filter(date => {
                return !allBookedDates.includes(date) && (halfDayBookingCounts[date] || 0) < 2;
            });
    
            return { full_day: availableFullDayDates, half_day: availableHalfDayDates };
        } catch (error) {
            throw new HttpException(error, HttpStatus.BAD_REQUEST);
        }
    }
    
}


