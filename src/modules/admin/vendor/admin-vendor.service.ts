import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../../../model/user.model';
import { isEmpty } from 'class-validator';
import { FeedBack } from 'src/model/feedback.model';
import { Pricing } from 'src/model/pricing.model';
import { NotificationService } from 'src/modules/notification/notification.service';
import { UserDTO } from 'src/dto/user.dto';



@Injectable()
export class AdminVendorService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>,
    @InjectModel('Feedback') private readonly feedBackModel: Model<FeedBack>,
    @InjectModel('Pricing') private readonly pricingModel: Model<Pricing>,
    private notificationService: NotificationService
  ) { }




  async getPendingVendors() {
    try {

      const vendors = await this.userModel.find({ status: 'pending', role: 'vendor' })

      return vendors

    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST)
    }

  }


  async getApprovedVendors() {
    try {
      const vendors = await this.userModel.find({ status: 'approved', role: 'vendor' });
      return vendors
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST)
    }

  }

  async getRejectedVendors() {
    try {
      const vendors = await this.userModel.find({ status: 'rejected', role: 'vendor' });
      return vendors

    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST)
    }

  }

  async getAllUserList() {
    try {
      return await this.userModel.find({ role: 'user' }).select('name email profile_image address')
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST)
    }
  }
  async getVendorDetail(vendor_id: string) {
    try {
      const vendor = await this.userModel.findOne({ _id: vendor_id, role: 'vendor' });
      let tourWithPricing = await this.pricingModel.find({ vendor: vendor_id }).populate('tour')


      let feedbacks = [];
      for (const tour of tourWithPricing) {
        let feedback = await this.feedBackModel.find({ tour: tour.tour._id }).populate('user', 'name profile_image')
        if (feedback !== null) {
          feedbacks = feedbacks.concat(feedback);    // remove nested array
        }
      }

      const vendorDetail = {
        profile: vendor,
        tours: tourWithPricing,
        feedbacks: feedbacks
      }
      return vendorDetail

    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST)
    }

  }

  async updateStatus(req: any) {
    try {
      const { id, status, message } = req;
      if (status === 'rejected' && isEmpty(message)) {
        throw new HttpException('Rejected reason is required', HttpStatus.BAD_REQUEST)
      }

      const vendor = await this.userModel.findOneAndUpdate(
        { _id: id },
        { status: status, message: message },
        { new: true, runValidators: true }      //runvalidators mean that i will check the validation in the mongoose schema
      );

      await this.notificationService.sendNotification('Profile Status Update', `You are ${status} by admin`, undefined, vendor._id, "vendor")
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }

  }

  async addBadge(req: any) {
    try {
      const { vendor_id, badge } = req;
      const vendor = await this.userModel.findOneAndUpdate(
        { _id: vendor_id, role: 'vendor', status: 'approved' },
        { badge: badge },
        { new: true }
      );
      if (badge === 'true') {
        await this.notificationService.sendNotification('Got Badge', `Congratulation you got badge by admin`, undefined, vendor_id, "vendor")

      } else if (badge === 'false') {
        await this.notificationService.sendNotification('Removed Badge', 'Badge removed by admin', undefined, vendor_id, "vendor")

      }

      return vendor
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }

  }

}


