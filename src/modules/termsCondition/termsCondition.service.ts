import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { TermsConditionDTO } from 'src/dto/termsCondition.dto';
import { EmailService } from 'src/Utils/Email.service';
import { TermsCondition } from 'src/model/termsCondition.model';
import { User } from 'src/model/user.model';







@Injectable()
export class TermsConditionService {
    constructor(
        @InjectModel('TermsCondition') private readonly termsConditionModel: Model<TermsCondition>,
        @InjectModel('User') private readonly userModel: Model<User>,
        private emailService: EmailService,
    ) { }

    async get() {
        try {
            return await this.termsConditionModel.find()

        } catch (error) {
            throw new HttpException(error, HttpStatus.BAD_REQUEST)

        }
    }

    async createOrUpdate(termsConditionDto: TermsConditionDTO) {
        try {
            const { terms_condition } = termsConditionDto;
            const options = { upsert: true, new: true, setDefaultsOnInsert: true };

            await this.termsConditionModel.findOneAndUpdate(
                {}, // This matches the first document in the collection
                { terms_condition }, // The update operation
                options
            );
            const usersAndVendors = await this.userModel.find({ role: { $ne: 'admin' } })
            const link = `${process.env.APP_URL}terms-and-condition`
            const emailPromises = usersAndVendors.map(user => {
                return this.emailService.updateTermsCondition((user.email as string), (user?.name as string), link, `New Terms & Condition`)
                    .then(() => console.log(`Email sent to ${user.email}`))
                    .catch(error => console.error(`Failed to send email to ${user.email}:`, error));
            });

            await Promise.all(emailPromises);
            return

        } catch (error) {
            throw new HttpException(error, HttpStatus.BAD_REQUEST)

        }
    }

    async topVendors() {
        try {
            const topVendors = await this.userModel.aggregate([
                {
                    $match: {
                        role: 'vendor',
                        rating: { $ne: 0 }
                    }
                },
                {
                    $sort: { rating: -1 }
                },
                {
                    $lookup: {
                        from: "tours", 
                        let : {vendorId: "$_id"},
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ["$vendor", "$$vendorId"] }, // Ensure the tour belongs to the vendor
                                            { $eq: ["$status", "approved"] } // Check if the tour status is 'approved'
                                        ]
                                    }
                                }
                            }
                        ],
                        as: "approvedTours"
                    }
                },
                {
                    $addFields: {
                        total_tours: { $size: "$approvedTours" }
                    }
                },
                {
                    $project:{
                        approvedTours : 0
                    }
                }
              
            ]).limit(10)
            return topVendors;
        } catch (error) {
          
            throw new HttpException(error, HttpStatus.BAD_REQUEST)
        }
    }

}


