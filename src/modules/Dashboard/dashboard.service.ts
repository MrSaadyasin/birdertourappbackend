import { Inject, Injectable } from '@nestjs/common'
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { User } from 'src/model/user.model'
import { Booking } from 'src/model/booking.model'
import { Tour } from 'src/model/tour.model'
import { Stripe } from 'stripe'





@Injectable()
export class DashboardService {
    constructor(@InjectModel('Tour') private readonly tourModel: Model<Tour>,
        @InjectModel('User') private readonly userModel: Model<User>,
        @InjectModel('Booking') private readonly bookingModel: Model<Booking>,
        @Inject('STRIPE') private readonly stripeClient: Stripe,
    ) { }

    async dashboardStats() {
        const totalUsers = await this.userModel.countDocuments({ role: 'user' })
        const totalVendors = await this.userModel.countDocuments({ role: 'vendor', status: 'approved' })
        const totalTours = await this.tourModel.countDocuments({ status: 'approved' })
        const totalBookings = await this.bookingModel.countDocuments({ payment_status: 'paid' })
        const balance = await this.stripeClient.balance.retrieve();
        // Find the USD balance
        const usdBalance = balance.available.find((balanceObj) => balanceObj.currency === 'usd');
        // Calculate the available balance in USD dollars
        const availableBalanceInUSD = usdBalance ? usdBalance.amount / 100 : 0;

        return {
            totalUsers: totalUsers,
            totalVendors: totalVendors,
            totalTours: totalTours,
            totalBookings: totalBookings,
            availableBalance: availableBalanceInUSD
        }

    }





  async getAllMailGroup(body: any){
    try {
      const {type } = body
       let emails = []
        if(type === 'user'){
          const users =  await this.userModel.find({role : 'user'}).select('email')
           emails = users.map(user => user.email);
       
        }
        
        else if(type === 'vendor'){
            const vendors = await this.userModel.find({role : 'vendor', status : 'approved'})
            emails = vendors.map(user => user.email);
        }
        return emails
        
    } catch (error) {
      
    }
  }
}


