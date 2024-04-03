import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { FeedBackDTO } from '../../dto/feedback.dto';
import { FeedBack } from '../../model/feedback.model';
import { User } from 'src/model/user.model';
import { Booking } from 'src/model/booking.model';
import * as moment from 'moment';






@Injectable()
export class FeedBackService {
    constructor(@InjectModel('Feedback') private readonly feedBackModel: Model<FeedBack>,
        @InjectModel('User') private readonly userModel: Model<User>,
        @InjectModel('Booking') private readonly bookingModel: Model<Booking>
    ) { }


    async getAll() {
        try {
            return await this.feedBackModel.find().populate('user', 'name email role').populate('tour', 'name')
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
        }

    }
  

    async pendingFeedBack(request: any) {
        try {
            const startDate = moment().startOf('day')
            const user_id = request['user'].id
            return await this.bookingModel.find({ user: user_id, payment_status: 'paid', feedback_status: 'pending', date: { $lte: startDate.toDate() } }).populate('tour')

        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
        }

    }

    async add(req: FeedBackDTO) {
        try {
            let { vendor_id, user_id,booking_id, tour_id, comment, rating, status } = req;
            // const user_id = request['user'].id
            if(status === 'cancel'){
              return  await this.bookingModel.findOneAndUpdate({ _id: booking_id }, { $set: { feedback_status: status } })
            }
            let type: string = ''
            // const user = request['user']
            const user = vendor_id ? await this.userModel.findOne({_id : vendor_id}).select('role name email') : await this.userModel.findOne({_id : user_id}).select('role email name')
            const booking =  await this.bookingModel.findOne({_id : booking_id}).populate('user', 'name email role').populate('vendor', 'name email role')
            const sendby = vendor_id ? booking.user._id : booking.vendor._id
            // if (user.role === 'user') {
            //     user_id = user.id
            //     type = 'user'
            // } else if (user.role === 'vendor') {
            //     vendor_id = user.id
            //     type = 'vendor'
            // }
    
            if(vendor_id){
                type = 'user'
            }else{
               type = 'vendor'
            }
          
            const updateObject = {
                user: user_id || booking.user._id,
                vendor: vendor_id || booking.vendor._id,
                tour: booking.tour._id,
                rating: Number(rating),
                type: type,
                comment : comment
            }
            type === 'user' ? await this.feedBackModel.findOneAndUpdate({ user: user_id || booking.user._id, tour: booking.tour._id, type: 'user' }, updateObject, { new: true, upsert: true }) :
                await this.feedBackModel.findOneAndUpdate({ type: 'vendor', vendor: vendor_id || booking.vendor._id, user: user_id }, updateObject, { new: true, upsert: true })
            let match = type === 'user' ?
                {
                    user: new mongoose.Types.ObjectId(user_id || booking.user._id),
                    type: 'user'
                } :
                {
                    vendor: new mongoose.Types.ObjectId(vendor_id || booking.vendor._id),
                    type: 'vendor'
                }
            const feedback = await this.feedBackModel.aggregate([
                {
                    $match: match
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: '$rating' }
                    }
                }

            ])
            if (type == 'user') {
                const vendorLength = await this.feedBackModel.countDocuments({ vendor: vendor_id, type: 'user' });
               
                let calculatedRating = feedback.length > 0 ? (feedback[0].total / vendorLength) : 0
            
              const v =  await this.userModel.findOneAndUpdate({ _id: vendor_id }, { $set: { rating: calculatedRating } }, {new : true})
                await this.bookingModel.findOneAndUpdate({ _id: booking_id }, { $set: { feedback_status: status } })
            } else {
                const userLength = await this.feedBackModel.countDocuments({ user: user_id, type: 'vendor' })
                let calculatedRating = feedback.length > 0 ? (feedback[0].total / userLength) : 0
                await this.userModel.findOneAndUpdate({ _id: user_id }, { $set: { rating: calculatedRating } })
            }


        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
        }
    }

}


