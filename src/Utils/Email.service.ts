// email.service.ts
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';
import * as moment from 'moment';


@Injectable()
export class EmailService {
    private transporter: nodemailer.Transporter;

    constructor() {
        // Initialize the nodemailer transporter
        this.transporter = nodemailer.createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            // port: 465,
            port: 587,
            security: false,
            auth: {
                user: process.env.TRANSPORTER_USER, // generated ethereal user
                pass: process.env.TRANSPORTER_PASS, // generated ethereal password
            },
            requireTLS: true
        });
    }

    async sendPasswordResetEmail(email: string, name: string, link: string, subject: String) {
        try {
            const templatePath = path.join('src', 'mailTemplates', `reset-password.hbs`);
            const source = fs.readFileSync(templatePath, 'utf8');
            const compiledTemplate = handlebars.compile(source);
            const context = {
                name,
                link
            }
            const html = compiledTemplate(context);
            await this.transporter.sendMail({
                from: process.env.USER,
                to: email,
                subject: subject,
                html: html,
            });

        } catch (error) {
            throw new HttpException(error, HttpStatus.BAD_REQUEST);
        }
    }

    async upCommingVendorTourReminder(upCommingBooking: any, subject: string) {
        try {
            const vendorEmail = upCommingBooking.vendor.email
            const location = JSON.parse(upCommingBooking.tour.location)
            const templatePath = path.join('src', 'mailTemplates', `upcomming-vendor-tour-reminder.hbs`);
            const source = fs.readFileSync(templatePath, 'utf8');
            const compiledTemplate = handlebars.compile(source);
            const context = {
                tourName: upCommingBooking.tour.name,
                date: moment(upCommingBooking.date).format('YYYY-MM-DD'),
                slot: upCommingBooking.booked_slot,
                type: upCommingBooking.booking_type === 'full_day' ? 'Full Day' : upCommingBooking.booking_type === 'half_day' ? 'Half Day' : upCommingBooking.booking_type === 'hourly_bases' ? 'Hourly' : '',
                destination: location.address,
                user: upCommingBooking.user.name,
                total: upCommingBooking.total,
                vendor: upCommingBooking.vendor.name

            }
            const html = compiledTemplate(context);
            await this.transporter.sendMail({
                from: process.env.USER,
                to: vendorEmail,
                subject: subject,
                html: html,
            });
        } catch (error) {
            throw new HttpException(error, HttpStatus.BAD_REQUEST);
        }
    }

    async upCommingUserTourReminder(upCommingBooking: any, subject: string) {
        try {
            const userEmail = upCommingBooking.user.email
            const location = JSON.parse(upCommingBooking.tour.location)
            const templatePath = path.join('src', 'mailTemplates', `upcomming-user-tour-reminder.hbs`);
            const source = fs.readFileSync(templatePath, 'utf8');
            const compiledTemplate = handlebars.compile(source);
            const context = {
                tourName: upCommingBooking.tour.name,
                date: moment(upCommingBooking.date).format('YYYY-MM-DD'),
                slot: upCommingBooking.booked_slot,
                type: upCommingBooking.booking_type === 'full_day' ? 'Full Day' : upCommingBooking.booking_type === 'half_day' ? 'Half Day' : upCommingBooking.booking_type === 'hourly_bases' ? 'Hourly' : '',
                destination: location.address,
                user: upCommingBooking.user.name,
                total: upCommingBooking.total,
                vendor: upCommingBooking.vendor.name

            }
            const html = compiledTemplate(context);
            await this.transporter.sendMail({
                from: process.env.USER,
                to: userEmail,
                subject: subject,
                html: html,
            });
        } catch (error) {
            throw new HttpException(error, HttpStatus.BAD_REQUEST);
        }
    }

    async vendorPaymentRequest(booking: any, admin: any, subject: string) {
        try {
            const adminEmail = admin.email
            const location = JSON.parse(booking.tour.location)
            const templatePath = path.join('src', 'mailTemplates', `vendor-payment-request.hbs`);
            const source = fs.readFileSync(templatePath, 'utf8');
            const compiledTemplate = handlebars.compile(source);

            const context = {
                userName: booking.user.name,
                userEmail: booking.user.email,
                vendorName: booking.vendor.name,
                vendorEmail: booking.vendor.email,
                tourName: booking.tour.name,
                date: moment(booking.date).format('YYYY-MM-DD'),
                slot: booking.booked_slot,
                type: booking.booking_type === 'full_day' ? 'Full Day' : booking.booking_type === 'half_day' ? 'Half Day' : booking.booking_type === 'hourly_bases' ? 'Hourly' : '',
                destination: location.address,
                link: `${process.env.APP_VENDOR_URL}admin/payments`,
                total: booking.total,
            }
            const html = compiledTemplate(context);
            await this.transporter.sendMail({
                from: process.env.USER,
                to: adminEmail,
                subject: subject,
                html: html,
            });
        } catch (error) {
            throw new HttpException(error, HttpStatus.BAD_REQUEST);
        }
    }



    async sentUserTourPayment(booking: any, admin: any, subject: string) {
        try {
            const adminEmail = admin.email
            const location = JSON.parse(booking.tour.location)
            const templatePath = path.join('src', 'mailTemplates', `payment-sent-to-admin.hbs`);
            const source = fs.readFileSync(templatePath, 'utf8');
            const compiledTemplate = handlebars.compile(source);

            const context = {
                userName: booking.user.name,
                userEmail: booking.user.email,
                vendorName: booking.vendor.name,
                vendorEmail: booking.vendor.email,
                tourName: booking.tour.name,
                date: moment(booking.date).format('YYYY-MM-DD'),
                slot: booking.booked_slot,
                type: booking.booking_type === 'full_day' ? 'Full Day' : booking.booking_type === 'half_day' ? 'Half Day' : booking.booking_type === 'hourly_bases' ? 'Hourly' : '',
                destination: location.address,
                total: booking.total,
            }
            const html = compiledTemplate(context);
            await this.transporter.sendMail({
                from: process.env.USER,
                to: adminEmail,
                subject: subject,
                html: html,
            });
        } catch (error) {
            throw new HttpException(error, HttpStatus.BAD_REQUEST);
        }
    }

    async vendorPaymentReceived(booking: any, admin: any, subject: string) {
        try {
            const adminName = admin.name
            const vendorEmail = booking.vendor.email
            const location = JSON.parse(booking.tour.location)
            const templatePath = path.join('src', 'mailTemplates', `vendor-payment-received.hbs`);
            const source = fs.readFileSync(templatePath, 'utf8');
            const compiledTemplate = handlebars.compile(source);
            const deductedAmount = Math.round(booking.total * 0.98)
            const context = {
                userName: booking.user.name,
                userEmail: booking.user.email,
                vendorName: booking.vendor.name,
                vendorEmail: booking.vendor.email,
                tourName: booking.tour.name,
                date: moment(booking.date).format('YYYY-MM-DD'),
                slot: booking.booked_slot,
                type: booking.booking_type === 'full_day' ? 'Full Day' : booking.booking_type === 'half_day' ? 'Half Day' : booking.booking_type === 'hourly_bases' ? 'Hourly' : '',
                destination: location.address,
                total: deductedAmount,
            }
            const html = compiledTemplate(context);
            await this.transporter.sendMail({
                from: process.env.USER,
                to: vendorEmail,
                subject: subject,
                html: html,
            });
        } catch (error) {
            throw new HttpException(error, HttpStatus.BAD_REQUEST);
        }
    }


    async vendorFeedbackTour(bookings: any, subject: string) {
        try {
            const templatePath = path.join('src', 'mailTemplates', `tour-completed-vendor-feedback.hbs`);
            const source = fs.readFileSync(templatePath, 'utf8');
            const compiledTemplate = handlebars.compile(source);
            bookings.forEach(async booking => {

                const link = `${process.env.APP_URL}feedback?booking_id=${booking._id}&user_id=${booking.user._id}`;
                const context = {
                    user: booking.user.name,
                    vendor: booking.vendor.name,
                    link: link
                }
                const vendorEmail = booking.vendor.email
                const html = compiledTemplate(context);
                await this.transporter.sendMail({
                    from: process.env.USER,
                    to: vendorEmail,
                    subject: subject,
                    html: html,
                });
            });
        } catch (error) {
            throw new HttpException(error, HttpStatus.BAD_REQUEST)
        }
    }
    async userFeedbackTour(bookings: any, subject: string) {
        try {
            const templatePath = path.join('src', 'mailTemplates', `tour-completed-user-feedback.hbs`);
            const source = fs.readFileSync(templatePath, 'utf8');
            const compiledTemplate = handlebars.compile(source);
            bookings.forEach(async booking => {

                const link = `${process.env.APP_URL}feedback?booking_id=${booking._id}&vendor_id=${booking.vendor._id}`;
                const context = {
                    tour: booking.tour.name,
                    user: booking.user.name,
                    vendor: booking.vendor.name,
                    link: link
                }
                const userEmail = booking.user.email
                const html = compiledTemplate(context);
                await this.transporter.sendMail({
                    from: process.env.USER,
                    to: userEmail,
                    subject: subject,
                    html: html,
                });
            });
        } catch (error) {
            throw new HttpException(error, HttpStatus.BAD_REQUEST)
        }
    }


    async tourBookingRequestForVendor(email: string, name: string, username: string, useremail: string, tourname: string, dates: any, subject: String) {
        try {
            const formatDate = (dates) => {
                // If dates is a string that looks like a JSON array, parse it
                if (typeof dates === 'string' && dates.startsWith('[')) {
                    try {
                        dates = JSON.parse(dates);
                    } catch (e) {
                        console.error('Error parsing dates:', e);
                        return ''; // Provide some default or error value
                    }
                }
            
                // After potential parsing, handle arrays or single dates
                if (Array.isArray(dates)) {
                    return dates.map(date => moment(date).format('YYYY-MM-DD')).join(',');
                } else {
                    // Format a single date string or the already parsed single date
                    return moment(dates).format('YYYY-MM-DD');
                }
            };
            const formattedDates = formatDate(dates);

            const templatePath = path.join('src', 'mailTemplates', `booking-request.hbs`);
            const source = fs.readFileSync(templatePath, 'utf8');
            const compiledTemplate = handlebars.compile(source);
            const context = {
                name,
                username,
                useremail,
                tourname,
                dates: formattedDates
            }
            const html = compiledTemplate(context);
            await this.transporter.sendMail({
                from: process.env.USER,
                to: email,
                subject: subject,
                html: html,
            });

        } catch (error) {
            throw new HttpException(error, HttpStatus.BAD_REQUEST);
        }
    }

    async approveTourBookingRequestStatus(email: string, name: string, tourname: string, vendorname: string, link: string, date: any, dates: any, subject: String) {
        try {
            const formatDate = (dateString) => {
                return moment(dateString).format('YYYY-MM-DD');
            };
            const templatePath = path.join('src', 'mailTemplates', `approve-booking-request-status.hbs`);
            const source = fs.readFileSync(templatePath, 'utf8');
            const compiledTemplate = handlebars.compile(source);
            const context = {
                name,
                link,
                tourname,
                vendorname,
                dates: date ? formatDate(date) : dates.map(dateStr => formatDate(dateStr))
            }
            const html = compiledTemplate(context);
            await this.transporter.sendMail({
                from: process.env.USER,
                to: email,
                subject: subject,
                html: html,
            });

        } catch (error) {
            throw new HttpException(error, HttpStatus.BAD_REQUEST);
        }
    }
    async rejectedTourBookingRequestStatus(email: string, name: string, description: string, tourname: string, vendorname: string, subject: String) {
        try {
            const templatePath = path.join('src', 'mailTemplates', `reject-tour-booking-request.hbs`);
            const source = fs.readFileSync(templatePath, 'utf8');
            const compiledTemplate = handlebars.compile(source);
            const context = {
                name,
                tourname,
                vendorname,
                description
            }
            const html = compiledTemplate(context);
            await this.transporter.sendMail({
                from: process.env.USER,
                to: email,
                subject: subject,
                html: html,
            });
            console.log('mail send successfully')

        } catch (error) {
            throw new HttpException(error, HttpStatus.BAD_REQUEST);
        }
    }

    async updateTermsCondition(email: string, name: string, link: string, subject: string) {
        try {
            const templatePath = path.join('src', 'mailTemplates', `update-terms-condition.hbs`);
            const source = fs.readFileSync(templatePath, 'utf8');
            const compiledTemplate = handlebars.compile(source);
            const context = {
                name,
                link
            }
            const html = compiledTemplate(context);
            await this.transporter.sendMail({
                from: process.env.USER,
                to: email,
                subject: subject,
                html: html,
            });
            console.log('mail send successfully ')
        } catch (error) {
            throw new HttpException(error, HttpStatus.BAD_REQUEST);
        }
    }
    async termsConditionForNewUser(email: string, name: string, link: string, subject: string) {
        try {
            const templatePath = path.join('src', 'mailTemplates', `terms-condition.hbs`);
            const source = fs.readFileSync(templatePath, 'utf8');
            const compiledTemplate = handlebars.compile(source);
            const context = {
                name,
                link
            }
            const html = compiledTemplate(context);
            await this.transporter.sendMail({
                from: process.env.USER,
                to: email,
                subject: subject,
                html: html,
            });
            console.log('mail send successfully ')
        } catch (error) {
            throw new HttpException(error, HttpStatus.BAD_REQUEST);
        }
    }
}