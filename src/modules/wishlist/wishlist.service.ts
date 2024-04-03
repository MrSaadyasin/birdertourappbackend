import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { WishListDTO } from 'src/dto/wishlist.dto';
import { WishList } from 'src/model/wishlist.model';
import { Pricing } from 'src/model/pricing.model';





@Injectable()
export class WishListService {
    constructor(@InjectModel('Wishlist') private readonly wishlistModel: Model<WishList>,
        @InjectModel('Pricing') private readonly pricingModel: Model<Pricing>,
    ) { }


    async getAll(req: any) {
        try {
            const user_id = req['user'].id
            const wishlist = await this.wishlistModel.find({ user: user_id }).populate({
               path: 'tour',
               populate : {
                path : 'vendor',
                select : 'name'
               }
             
            })
            const tourPricing = await this.getAllTours(wishlist)
            return tourPricing
        } catch (error) {
            throw new HttpException(error, HttpStatus.BAD_REQUEST)
        }


    }

    async tour(req: WishListDTO, request: any) {
        try {
            const { tour_id } = req;
            const user_id = request['user'].id
            const wishlist = await this.wishlistModel.findOne({ user: user_id, tour: tour_id })
            if (wishlist) {
                await this.wishlistModel.findOneAndDelete({ user: user_id, tour: tour_id })
            } else {
                const wishlist = {
                    user: user_id,
                    tour: tour_id,
                }
                return new this.wishlistModel(wishlist).save();
            }

        } catch (error) {
            throw new HttpException(error, HttpStatus.BAD_REQUEST)
        }
    }

    async getAllTours(tours: any) {
        try {

            const tourIds = tours.map(tour => tour.tour._id);
            const pricings = await this.pricingModel.find({ tour: { $in: tourIds } });
            const mergedData = tours.map(tour => {
                const pricing = pricings.find(pricing => pricing.tour.toString() === tour.tour._id.toString())
                return {
                    // ...tour,
                    tour: {
                        ...tour['_doc'],
                        pricing: pricing ? pricing : null,
                    },
                };
            });

            return mergedData
        } catch (error) {
            throw new HttpException(error, HttpStatus.BAD_REQUEST)
        }
    }





}


