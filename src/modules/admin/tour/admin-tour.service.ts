import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Tour } from '../../../model/tour.model';
import { Pricing } from '../../../model/pricing.model';
import { isEmpty } from 'class-validator';
import { Booking } from 'src/model/booking.model';
import { NotificationService } from 'src/modules/notification/notification.service';
import { SearchKeyword } from 'src/model/searchKeywords.model';


@Injectable()
export class AdminTourService {
  constructor(@InjectModel('Tour') private readonly tourModel: Model<Tour>,
    @InjectModel('Pricing') private readonly pricingModel: Model<Pricing>,
    @InjectModel('Booking') private readonly bookingModel: Model<Booking>,
    @InjectModel('SearchKeyword') private readonly searchKeywordModel: Model<SearchKeyword>,
    private notificationService: NotificationService
  ) { }




  async getPendingTours() {
    try {
      const tours = await this.tourModel.find({ status: 'pending' }).populate('vendor', 'name email role profile_image badge').sort({ createdAt: -1 });

      return this.getAllTours(tours)



    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST)
    }

  }

  async getEditedTours() {
    try {
      const tours = await this.tourModel.find({ status: 'edited' }).populate('vendor', 'name email role profile_image badge').sort({ createdAt: -1 });

      return this.getAllTours(tours)



    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST)
    }

  }

  async getApprovedTours() {
    try {
      const tours = await this.tourModel.find({ status: 'approved' }).populate('vendor', 'name email role profile_image badge').sort({ createdAt: -1 });;
      return this.getAllTours(tours)
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST)
    }

  }

  async getRejectedTours() {
    try {
      const tours = await this.tourModel.find({ status: 'rejected' }).populate('vendor', 'name email role profile_image badge').sort({ createdAt: -1 });
      return this.getAllTours(tours)

    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST)
    }

  }

  async getAllTours(tours: any) {
    try {

      const tourIds = tours.map(tour => tour._id);
      const pricings = await this.pricingModel.find({ tour: { $in: tourIds } });
      const mergedData = tours.map(tour => {
        const pricing = pricings.find(pricing => pricing.tour.toString() === tour._id.toString());
        return {
          ...tour['_doc'],
          pricing: pricing ? pricing : null
        };
      });
      return mergedData
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
      const tour = await this.tourModel.findOneAndUpdate(
        { _id: id },
        { status: status, message: message },
        { new: true, runValidators: true }      //runvalidators mean that i will check the validation in the mongoose schema
      )
      let vendor_id = tour.vendor.toString()
      await this.notificationService.sendNotification('Tour Status Update', `${tour.name} tour is ${status} by admin`, undefined, vendor_id, "vendor")

    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }

  }

  async searchKeywords() {
    // Fetch all keywords as plain JavaScript objects
    const allKeywords = await this.searchKeywordModel.find().lean();

    // Parse the stringified JSON for each keyword
    const parsedKeywords = allKeywords.map(entry => ({
      ...entry,
      country_location: JSON.parse(entry.country_location)
    }));

    // Aggregate the results based on the country and keyword
    const aggregatedResults = parsedKeywords.reduce((acc, curr) => {
      const country = curr.country_location.country;
      const keyword = curr.keyword;

      // Create a unique key for country and keyword combination
      const countryKeywordCombo = `${country}-${keyword}`;

      // Initialize the combination in the accumulator if it doesn't exist
      if (!acc[countryKeywordCombo]) {
        acc[countryKeywordCombo] =
        {
          country: country,
          keyword: keyword,
          count: 0
        };
      }

      // Increase the count for the country and keyword combination
      acc[countryKeywordCombo].count += 1;

      return acc;
    }, {});

    // Convert the object into an array with desired structure
    const finalResult = Object.values(aggregatedResults).map((entry: any) => ({
      country: entry.country,
      count: entry.count,
      keywords: entry.keyword
    }));

    return finalResult;
  }

  async getTopSearchKeywords() {
    // Fetch all keywords as plain JavaScript objects
    const allKeywords = await this.searchKeywordModel.find().lean();

    // Parse the stringified JSON for each keyword
    const parsedKeywords = allKeywords.map(entry => ({
        ...entry,
        country_location: JSON.parse(entry.country_location)
    }));

    // Aggregate the results based on the keyword
    const keywordSearchCounts: Record<string, number> = parsedKeywords.reduce((acc, curr) => {
        const keyword = curr.keyword;

        // Initialize the keyword in the accumulator if it doesn't exist
        if (!acc[keyword]) {
            acc[keyword] = 0;
        }

        // Increase the count for the keyword
        acc[keyword] += 1;

        return acc;
    }, {});

    // Convert the object into an array, sort it based on search counts, and take top 6
    const topSearchKeywords = Object.keys(keywordSearchCounts)
        .map(keyword => ({
            keyword: keyword,
            totalSearches: keywordSearchCounts[keyword]
        }))
        .sort((a, b) => b.totalSearches - a.totalSearches)
        .slice(0, 6);
        
    return topSearchKeywords;
}



}





