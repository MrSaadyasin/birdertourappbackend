import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Tour } from 'src/model/tour.model';
import { Pricing } from 'src/model/pricing.model';
import { FeedBack } from 'src/model/feedback.model';
import { TourDTO } from 'src/dto/tour.dto';
import { FileUploadService } from 'src/Utils/UploadFile.service';
import { Request } from 'express';
import { User } from 'src/model/user.model';
import { Booking } from 'src/model/booking.model';
import { SearchKeyword } from 'src/model/searchKeywords.model';
import { DateTimeFormatter } from 'src/Utils/DateTimeFormatter.service';
import * as moment from 'moment'
import * as ipinfo from 'ipinfo'
import { TourSearchDTO } from 'src/dto/tour-search.dto';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class TourService {
  constructor(@InjectModel('Tour') private readonly tourModel: Model<Tour>,
    @InjectModel('Pricing') private readonly pricingModel: Model<Pricing>,
    @InjectModel('Feedback') private readonly feedBackModel: Model<FeedBack>,
    @InjectModel('User') private readonly userModel: Model<User>,
    @InjectModel('Booking') private readonly bookingModel: Model<Booking>,
    @InjectModel('SearchKeyword') private readonly searchKeywordModel: Model<SearchKeyword>,
    private fileUpload: FileUploadService,
    private notificationService: NotificationService,
    private dateTimeFormatter: DateTimeFormatter) { }


  async getAll() {
    const startDate = moment().startOf('day')
    // const tours = await this.tourModel.find({ status: 'approved', updatedAt: { $gte: startDate.toDate() } }).populate('vendor', 'name email start_date end_date profile_image badge');
    const tours = await this.tourModel.find({ status: 'approved' }).populate('vendor', 'name email start_date end_date profile_image badge rating').sort({ updatedAt: -1 });
    return this.getAllTours(tours)
  }
  async upComingsTours() {
    try {
      // const startDate = moment().startOf('day').add(1, 'day').clone();
      const startDate = moment().startOf('day');
      // const startDate = moment().startOf('day').clone();
      const endDate = startDate.clone().add(7, 'days').subtract(1, 'millisecond');
      const tours = await this.tourModel.find({ status: 'approved', updatedAt: { $gte: startDate.toDate(), $lte: endDate.toDate() } }).populate('vendor', 'name email badge');
      return this.getAllTours(tours)
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST)
    }

  }

  async searchTour(body: TourSearchDTO, request: Request) {
    try {

      const { type, name, address, date } = body;
      const startDate = moment().startOf('day')
      if (type === 'vendor') {
        await this.searchKeyword(name, request)
        const regex = new RegExp(name, 'i')
        let tours = await this.tourModel
          .find({ status: 'approved' })
          .populate({ path: 'vendor', match: { name: { $regex: regex }, role: 'vendor' }, select: 'name email available_time_slots start_date end_date' });

        if (!tours || tours.length === 0) {
          return []; // Return an empty array if no tours are found
        }
        if (!date) {
          // Filter out tours without a matched vendor
          tours = tours.filter(tour => tour.vendor);
          return this.getAllTours(tours);
        }

        const isTourAvailable = async (tour) => {
          if (!tour.vendor) {
            return false;  // remove tours without matched vendor
          }
          // Check if the date is not within the vendor's availability range
          const isWithinDateRange = moment(date).isBetween(tour.vendor.start_date, tour.vendor.end_date, null, '[]');
          if (!isWithinDateRange) {
            return false;  // exclude tours where the date is outside the vendor's availability
          }

          // Fetch bookings for the current tour
          const bookings = await this.bookingModel.find({ tour: tour._id, date: date });

          if (bookings.some(booking => booking.booking_type === 'full_day')) {
            return false;  // exclude tours with a full_day booking
          }

          const halfDayBookingCount = bookings.filter(booking => booking.booking_type === 'half_day').length;
          if (halfDayBookingCount >= 2) {
            return false;  // exclude tours with two or more half_day bookings
          }

          return true;  // include the tour in the results
        };

        // Fetch availability for all tours in parallel
        const availabilityArray = await Promise.all(tours.map(isTourAvailable));

        // Filter the tours based on the availability array
        tours = tours.filter((tour, index) => availabilityArray[index]);
        return this.getAllTours(tours);

      }
      if (type === 'location') {
        await this.searchKeyword(address, request)

        const tours = await this.tourModel
          .find({ status: 'approved' })
          .populate('vendor', 'name email address badge')
        const addressParts = address.split(',').map(part => part.trim()); //  splitting


        const filteredTours = tours.filter(tour => {
          const vendorAddress = JSON.parse((tour).location as string).address; // convert vendor address to lower case too
          if (vendorAddress) {
            return addressParts.every(part => vendorAddress.includes(part))
          }
        })
        return this.getAllTours(filteredTours);

      }
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST)
    }
  }

  async searchKeyword(keyword: string, request: Request) {
    const ip = request.headers['x-forwarded-for'] || request.connection.remoteAddress;
    const location = await ipinfo(ip);
    // const testIP = '8.8.8.8';
    // const location = await ipinfo(testIP);
    return await this.searchKeywordModel.create({
      keyword: keyword.toLowerCase(),
      country_location: JSON.stringify(location)
    })
  }

  async create(req: TourDTO, request: Request) {
    try {
      const { name, description, vendor_id, location, captions } = req;
      const captionArray = JSON.parse(captions);
      const vendor = await this.userModel.findOne({ _id: vendor_id })

      if (vendor.start_date === '' || vendor.end_date === '' || vendor.start_time === '' || vendor.end_time === '' || vendor.address === '') {
        // throw new HttpException('Your user account is pending approval. Please allow one business day for approval', HttpStatus.BAD_REQUEST)
        throw new HttpException('Please complete your profile', HttpStatus.BAD_REQUEST)
      }
      const files = request.files as any;

      const images = files.images;
      if (!images) {
        throw new HttpException('Images are required', HttpStatus.BAD_REQUEST)
      }
      if (images.length > 10) {
        throw new HttpException('Images should not contain more than 10 items', HttpStatus.BAD_REQUEST)
      }
      // const imageFiles = await Promise.all(
      //   images.map(async (image) => {

      //     return this.fileUpload.uploadSingleFile(image.buffer, image.originalname);
      //   })
      // );
      const imageWithCaption = await Promise.all(
        images.map(async (image, index) => {
          const uploadedFile = await this.fileUpload.uploadSingleFile(image.buffer, image.originalname)
          return {
            image: uploadedFile.Location,
            caption: captionArray[index]
          };
        })
      );
      let file;
      if (files?.video?.length > 0) {
        const video = files.video[0];
        file = await this.fileUpload.uploadSingleFile(video.buffer, video.originalname);
      }
      const tourObject = {
        name: name,
        description: description,
        video: file ? file.Location : '',
        // images: imageFiles.map((file) => file.Location),
        caption_images: imageWithCaption,
        vendor: vendor_id,
        location: location,
      }

      const createdTour = new this.tourModel(tourObject);
      await createdTour.save();
      await this.notificationService.sendNotification('New Tour Register', 'New tour registered', undefined, vendor_id)
      return createdTour
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST)
    }
  }

  async createTourPricing(tour: Object, req: TourDTO) {
    try {
      const { full_day, half_day, hourly_bases, vendor_id } = req
      const tourId = tour['_id'];
      const pricingObject = {
        vendor: vendor_id,
        tour: tourId,
        full_day: full_day,
        half_day: half_day,
        // hourly_bases: hourly_bases
      }
      const createdTourPrice = new this.pricingModel(pricingObject);
      await createdTourPrice.save();
      return createdTourPrice
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST)
    }

  }

  async updateTourPricing(tour: Object, body: TourDTO) {
    try {
      const { full_day, half_day, hourly_bases } = body
      const tourId = tour['_id'];
      const pricing = await this.pricingModel.findOne({ tour: tourId })
      pricing.full_day = full_day;
      pricing.half_day = half_day;
      // pricing.hourly_bases = hourly_bases;

      await pricing.save();
      return pricing;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST)
    }

  }

  async getPendingTours(req: any) {
    try {
      const id = req['user'].id
      const tours = await this.tourModel.find({ status: 'pending', vendor: id }).populate('vendor', 'name email role profile_image badge');
      return this.getAllTours(tours)

    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST)
    }

  }


  async getApprovedTours(req: any) {
    try {
      const id = req['user'].id
      const tours = await this.tourModel.find({ status: 'approved', vendor: id }).populate('vendor', 'name email role profile_image badge');
      return this.getAllTours(tours)

    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST)
    }

  }
  async getEditedTours(req: any) {
    try {
      const id = req['user'].id
      const tours = await this.tourModel.find({ status: 'edited', vendor: id }).populate('vendor', 'name email role profile_image badge');
      return this.getAllTours(tours)

    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST)
    }

  }

  async getRejectedTours(req: any) {
    try {
      const id = req['user'].id
      const tours = await this.tourModel.find({ status: 'rejected', vendor: id }).populate('vendor', 'name email role profile_image badge');
      return this.getAllTours(tours)

    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST)
    }

  }

  async updateTour(id: string, body: TourDTO, request: any) {
    try {
      const { name, description, location, captions, old_images } = body
      const old_images_array = JSON.parse(old_images)
      const vendor_id = request['user'].id
      const captionArray = JSON.parse(captions);
      const tour = await this.tourModel.findById(id);

      if (tour) {
        const startDate = moment().startOf('day')
        const booking = await this.bookingModel.find({ tour: tour._id, payment_status: 'paid', date: { $gte: startDate.toDate() } })
        if (booking.length > 0) {
          throw new HttpException('This tour already has booking', HttpStatus.BAD_REQUEST)
        }
        let existingImages: any[] = tour.caption_images as any[];

        const imageUrlsFromDB: any[] = existingImages.map((imageObj: any) => imageObj.image);
        let updatedCaptionImages: any[] = [];
        let processedUrls: Set<string> = new Set();

        old_images_array.forEach(url => {
          if (imageUrlsFromDB.includes(url) && !processedUrls.has(url)) {
            let imageIndex = imageUrlsFromDB.indexOf(url);
            updatedCaptionImages.push(existingImages[imageIndex]);
            processedUrls.add(url);
          }
        });

        const files = request.files as any;
        const images = files.images || []
        if (images) {
          if ((updatedCaptionImages.length + images.length) > 10) {
            throw new HttpException('Images should not contain more than 10 items', HttpStatus.BAD_REQUEST);
          }
          const imageWithCaption = await Promise.all(
            images.map(async (image, index) => {
              const uploadedFile = await this.fileUpload.uploadSingleFile(image.buffer, image.originalname);
              return {
                image: uploadedFile.Location,
                caption: captionArray[index]
              };
            })
          );

          // Combine old and new images
          updatedCaptionImages = [...updatedCaptionImages, ...imageWithCaption];
        } else {
          // If no images are provided, retain the old images
          updatedCaptionImages = existingImages;
        }
        let file;
        if (files.video) {
          const video = files.video[0];
          file = await this.fileUpload.uploadSingleFile(video.buffer, video.originalname);
        }

        tour.name = name
        tour.description = description
        tour.location = location
        tour.video = file ? file.Location : tour.video
        tour.caption_images = updatedCaptionImages as any
        tour.status = 'edited'
        await tour.save();
        await this.notificationService.sendNotification('Tour Updated', `${tour.name} Tour Modified`, undefined, vendor_id)
        return tour
      } else {
        throw new HttpException('Tour Not Found', HttpStatus.NOT_FOUND)
      }
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST)
    }
  }
  async getTourDetail(req: any, tour_id: string) {
    try {
      const id = req['user'].id
      let tour = await this.tourModel.findOne({ _id: tour_id, vendor: id }).populate('vendor', 'name email role profile_image badge booking_request documents languages description address');
      let pricing = await this.pricingModel.findOne({ tour: tour_id });
      const feedback = await this.feedBackModel.find({ tour: tour_id, type: 'user' })

      const tourWithFeedbacks = { ...tour.toObject(), pricing: pricing, feedbacks: feedback };
      return tourWithFeedbacks

    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST)
    }

  }
  async getAllBookings(tour_id: string) {
    try {
      const startDate = moment().startOf('day')
      return await this.bookingModel.find({ tour: tour_id, payment_status: 'paid', date: { $lte: startDate.toDate() } }).populate('user', 'name email profile_image')
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST)
    }

  }


  async getUserTourDetail(tour_id: string) {
    try {

      let tour = (await this.tourModel.findOne({ '_id': tour_id }).populate('vendor', 'name email profile_image rating description badge booking_request'))
      let pricing = await this.pricingModel.findOne({ 'tour': tour_id });

      const feedbacks = await this.feedBackModel.find({ type: 'user', vendor : tour.vendor._id }).populate('user', 'name profile_image')
      return { ...tour.toObject(), pricing: pricing, feedbacks: feedbacks }

    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }

  }
  async topTours(){
    try {
      const topTours = await this.bookingModel.aggregate([
        { $match: { payment_status: 'paid' } },
        { $group: { 
            _id: '$tour', 
            numBookings: { $sum: 1 } 
          }
        },
        { $sort: { numBookings: -1 } },
        { $limit: 10 } // Optional: Limits the number of top tours you want to retrieve
      ]);
      
      // Optionally, populate the tour details for each group
      for (let i = 0; i < topTours.length; i++) {
        topTours[i].tour = await this.tourModel.findById(topTours[i]._id).populate('vendor', 'rating name email').exec();
        topTours[i].pricing = await this.pricingModel.findOne({ 'tour': topTours[i]._id }).exec();
      }
      return topTours;

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
          pricing: pricing ? pricing : null,
        };
      });
      return mergedData
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST)
    }
  }


  compileBookedSlots(bookings: any) {
    const bookedSlots = {
      full_day: [],
      half_day: [],
      hourly_bases: []
    };

    bookings.forEach(booking => {
      if (booking.booking_type === 'full_day') {
        bookedSlots.full_day.push(this.dateTimeFormatter.convertToDate(booking.date));
      } else if (booking.booking_type === 'half_day') {
        bookedSlots.half_day.push(this.dateTimeFormatter.convertToDate(booking.date));
      } 
      // else if (booking.booking_type === 'hourly_bases') {
      //   bookedSlots.hourly_bases.push(this.dateTimeFormatter.convertToDate(booking.date));
      // }
    });

    return bookedSlots;
  }


}


