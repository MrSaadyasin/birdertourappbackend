import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { User } from '../../model/user.model';
import { UserDTO } from '../../dto/user.dto'
import { JwtService } from '@nestjs/jwt';
import { Token } from '../../model/token.model';
import { EmailService } from 'src/Utils/Email.service';
import { GetFullUrl } from 'src/Utils/GetFulUrl';
import { FileUploadService } from 'src/Utils/UploadFile.service';
import { Request } from 'express';
import { DateTimeFormatter } from 'src/Utils/DateTimeFormatter.service';
import { NotificationService } from '../notification/notification.service';


@Injectable()
export class AuthService {
    constructor(
        @InjectModel('User') private readonly userModel: Model<User>,
        @InjectModel('Token') private readonly tokenModel: Model<Token>,
        private readonly jwtService: JwtService,
        private readonly emailService: EmailService,
        private readonly fullUrlService: GetFullUrl,
        private fileUpload: FileUploadService,
        private dateTimeFormatter: DateTimeFormatter,
        private notificationService: NotificationService
    ) { }


    async register(req: UserDTO) {
        try {
            const { email, password, password_confirm,role } = req;
            if (password != password_confirm) {
                throw new HttpException('Password do not match', HttpStatus.BAD_REQUEST)
            }
            const user = await this.userModel.findOne({ email })
            if (user) {
                throw new HttpException('User Already Exist', HttpStatus.BAD_REQUEST)
            }
            // Check for Admin Role
        if (role === 'admin') {
            const existingAdmin = await this.userModel.findOne({ role: 'admin' });
            if (existingAdmin) {
                throw new HttpException(`Can't register as an admin`, HttpStatus.BAD_REQUEST);
            }
        }
            const createUser = new this.userModel(req);
            await createUser.save();
            if (createUser.role === 'vendor') {
                await this.notificationService.sendNotification('Vendor Sign Up', 'New vendor registered', undefined, createUser._id)
            }
            const link = `${process.env.APP_URL}terms-and-condition`
            await this.emailService.termsConditionForNewUser((createUser.email as string),(createUser?.name as string), link, `Terms & Condition`)
            return createUser
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
        }

    }
    async login(req: Request) {
        try {
            const url = this.fullUrlService.getUrl(req);
            const user = await this.checkUserRedirection(url, req)
            const { password } = req.body;
            if (await bcrypt.compare(password, user.password)) {
                return user
            } else {
                throw new HttpException('invalid credential', HttpStatus.BAD_REQUEST);
            }
        } catch (error) { 
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }

    }
    async updateProfile(req: any) {
        try {
   
            const { name, email, address, start_date, start_time, end_date, end_time, startTime, endTime, description, languages,dates,booking_request } = req.body
        
            let user_id = req['user'].id
            const files = req.files as any;
            let profile;
            if (files?.profile_image?.length > 0) {
                const profile_image = files.profile_image[0];
                profile = await this.fileUpload.uploadSingleFile(profile_image.buffer, profile_image.originalname);
            }
            let documents;
            if (files?.documents?.length > 0) {
                documents = await Promise.all(
                    files?.documents.map(async (document) => {
                        return this.fileUpload.uploadSingleFile(document.buffer, document.originalname);
                    })
                );
            }

            
            let formated_start_date = start_date ? start_date : ''
            let formated_end_date = end_date ? end_date : ''
            let available_time_slots = start_time ? this.dateTimeFormatter.createTimeSlots(start_time, end_time) : ''
            let formated_start_time = start_time ? start_time : ''
            let formated_end_time = end_time ? end_time : ''
    
            // let available_dates = 
            let profileObject = {
                name: name,
                address: address,
                profile_image: undefined,
                documents: undefined,
                available_time_slots: undefined,
                start_date: formated_start_date,
                start_time: formated_start_time,
                languages: languages,
                end_date: formated_end_date,
                end_time: formated_end_time,
                startTime: startTime,
                endTime: endTime,
                description: description,
                booking_request : booking_request,
                dates : dates && JSON.parse(dates)
            }

            if (profile) {
                profileObject.profile_image = profile.Location
            }
            // If new documents were provided, include them in the update.
            if (documents && documents.length > 0) {
                profileObject.documents = documents.map((file) => ({ url: file.Location, filename: file.key }));
            }
            if (available_time_slots) {
                profileObject.available_time_slots = available_time_slots
            }
            return await this.userModel.findOneAndUpdate({ "_id": user_id }, { $set: profileObject }, { new: true })

        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);

        }
    }
    async getProfile(req: UserDTO) {
        try {
            const user_id = req['user'].id;
            return await this.userModel.findOne({ _id: user_id })


        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }

    }

    async forgotPassword(req: Request) {
        try {
            const url = this.fullUrlService.getUrl(req);
            const user = await this.checkUserRedirection(url, req)
            let { email } = req.body;
            let token: string;

            const Checktoken = await this.tokenModel.findOne({ user_id: user._id })
            if (!Checktoken) {
                token = await bcrypt.genSalt(10)
                await this.tokenModel.create({
                    user_id: user._id,
                    token: token
                })
            }
            const userName = user.name as string
            let redirectLink = user.role == 'user' ? `${process.env.APP_URL}` : `${process.env.APP_VENDOR_URL}`
            const link = `${redirectLink}updatePassword?user_id=${user._id}&token=${token}`;
            await this.emailService.sendPasswordResetEmail(email, userName, link, `Reset Your Password`)
            console.log('Email sent successfully')
            return

        } catch (error) {

            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }
    async resetPassword(req: any) {
        try {
            // const { token, user_id } = query;
            const { user_id, token, password, password_confirm } = req;
            const getGeneratedToken = await this.tokenModel.findOne({ user_id: user_id })
            if (token != getGeneratedToken?.token) {
                throw new HttpException('Invalid Or Expire Token', HttpStatus.BAD_REQUEST);
            }
            const user = await this.userModel.findOne({ _id: user_id })
            if (!user) {
                throw new HttpException('User Not Found', HttpStatus.BAD_REQUEST);
            }
            if (password != password_confirm) {
                throw new HttpException('Password does not match', HttpStatus.BAD_REQUEST)
            }
            user.password = password
            await user.save();
            await getGeneratedToken.deleteOne()
            return user;

        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }
    async updatePassword(req: any) {
        try {
            // const { token, user_id } = query;
            const user_id = req['user'].id
            const { old_password, new_password, confirm_password } = req.body;

            const user = await this.userModel.findOne({ _id: user_id })
            if (!user) {
                throw new HttpException('User Not Found', HttpStatus.BAD_REQUEST);
            }
            if (new_password != confirm_password) {
                throw new HttpException('Password does not match', HttpStatus.BAD_REQUEST)
            }
            if (await bcrypt.compare(old_password, user.password)) {
                user.password = new_password
                return await user.save();
            } else {
                throw new HttpException('invalid credential', HttpStatus.BAD_REQUEST);
            }

        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }
    async logout(res: any) {
        try {
            return res.clearCookie('token');
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }
    async allVendors() {
        try {
            return await this.userModel.find({ role: 'vendor', status: 'approved' }).select('name address rating profile_image')
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    async CheckSocialUser(req: any) {
        try {
            const { name, email, google_id, role } = req;
            let user = await this.userModel.findOne({ email })
            if (user) {
                return user;
            }
            const createUser = new this.userModel({
                name: name,
                email: email,
                role: role,
                google_id: google_id
            });
            await createUser.save();
            return createUser


        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    async CheckFacebookSocialUser(req: any) {
        try {

            const { id, first_name, last_name, role } = req;
            let user = await this.userModel.findOne({ facebook_id: id })
            if (user) {
                return user;
            }
            let email = first_name + last_name + '@facebook.com'
            const createUser = new this.userModel({
                name: first_name + last_name,
                email: email,
                role: role,
                facebook_id: id
            });
            await createUser.save();
            return createUser


        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    async signPayload(user: any) {
        const { name, email, id, role, google_id, status } = user
        const payload = {
            name: name,
            email: email,
            id: id,
            google_id: google_id,
            role: role,
            status: status
        };
        return this.jwtService.sign(payload);
    }


    async setCookieToken(token: any, res: any) {

        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            expires: new Date(Date.now() + 1 * 24 * 60 * 1000),   //one day
            // secure: process.env.NODE_ENV === 'production',
        });
    }

    async checkUserRedirection(url: string, req: Request) {
        try {
            let { email } = req.body;
            email = email.trim().toLowerCase()
            const user = await this.userModel.findOne({ email });

            if (!user) {
                throw new HttpException('user not found', HttpStatus.BAD_REQUEST);
            }

            let role = user.role
            if (process.env.APP_URL === url && role === 'user') {
                return user
            }
            else if (process.env.APP_VENDOR_URL === url && (role === 'vendor' || 'admin')) {
                return user
            }
            throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }
}


