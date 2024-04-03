"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const nodemailer = require("nodemailer");
const handlebars_1 = require("handlebars");
const fs = require("fs");
const path = require("path");
const moment = require("moment");
let EmailService = class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            port: 587,
            security: false,
            auth: {
                user: process.env.TRANSPORTER_USER,
                pass: process.env.TRANSPORTER_PASS,
            },
            requireTLS: true
        });
    }
    async sendPasswordResetEmail(email, name, link, subject) {
        try {
            const templatePath = path.join('src', 'mailTemplates', `reset-password.hbs`);
            const source = fs.readFileSync(templatePath, 'utf8');
            const compiledTemplate = handlebars_1.default.compile(source);
            const context = {
                name,
                link
            };
            const html = compiledTemplate(context);
            await this.transporter.sendMail({
                from: process.env.USER,
                to: email,
                subject: subject,
                html: html,
            });
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async upCommingVendorTourReminder(upCommingBooking, subject) {
        try {
            const vendorEmail = upCommingBooking.vendor.email;
            const location = JSON.parse(upCommingBooking.tour.location);
            const templatePath = path.join('src', 'mailTemplates', `upcomming-vendor-tour-reminder.hbs`);
            const source = fs.readFileSync(templatePath, 'utf8');
            const compiledTemplate = handlebars_1.default.compile(source);
            const context = {
                tourName: upCommingBooking.tour.name,
                date: moment(upCommingBooking.date).format('YYYY-MM-DD'),
                slot: upCommingBooking.booked_slot,
                type: upCommingBooking.booking_type === 'full_day' ? 'Full Day' : upCommingBooking.booking_type === 'half_day' ? 'Half Day' : upCommingBooking.booking_type === 'hourly_bases' ? 'Hourly' : '',
                destination: location.address,
                user: upCommingBooking.user.name,
                total: upCommingBooking.total,
                vendor: upCommingBooking.vendor.name
            };
            const html = compiledTemplate(context);
            await this.transporter.sendMail({
                from: process.env.USER,
                to: vendorEmail,
                subject: subject,
                html: html,
            });
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async upCommingUserTourReminder(upCommingBooking, subject) {
        try {
            const userEmail = upCommingBooking.user.email;
            const location = JSON.parse(upCommingBooking.tour.location);
            const templatePath = path.join('src', 'mailTemplates', `upcomming-user-tour-reminder.hbs`);
            const source = fs.readFileSync(templatePath, 'utf8');
            const compiledTemplate = handlebars_1.default.compile(source);
            const context = {
                tourName: upCommingBooking.tour.name,
                date: moment(upCommingBooking.date).format('YYYY-MM-DD'),
                slot: upCommingBooking.booked_slot,
                type: upCommingBooking.booking_type === 'full_day' ? 'Full Day' : upCommingBooking.booking_type === 'half_day' ? 'Half Day' : upCommingBooking.booking_type === 'hourly_bases' ? 'Hourly' : '',
                destination: location.address,
                user: upCommingBooking.user.name,
                total: upCommingBooking.total,
                vendor: upCommingBooking.vendor.name
            };
            const html = compiledTemplate(context);
            await this.transporter.sendMail({
                from: process.env.USER,
                to: userEmail,
                subject: subject,
                html: html,
            });
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async vendorPaymentRequest(booking, admin, subject) {
        try {
            const adminEmail = admin.email;
            const location = JSON.parse(booking.tour.location);
            const templatePath = path.join('src', 'mailTemplates', `vendor-payment-request.hbs`);
            const source = fs.readFileSync(templatePath, 'utf8');
            const compiledTemplate = handlebars_1.default.compile(source);
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
            };
            const html = compiledTemplate(context);
            await this.transporter.sendMail({
                from: process.env.USER,
                to: adminEmail,
                subject: subject,
                html: html,
            });
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async sentUserTourPayment(booking, admin, subject) {
        try {
            const adminEmail = admin.email;
            const location = JSON.parse(booking.tour.location);
            const templatePath = path.join('src', 'mailTemplates', `payment-sent-to-admin.hbs`);
            const source = fs.readFileSync(templatePath, 'utf8');
            const compiledTemplate = handlebars_1.default.compile(source);
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
            };
            const html = compiledTemplate(context);
            await this.transporter.sendMail({
                from: process.env.USER,
                to: adminEmail,
                subject: subject,
                html: html,
            });
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async vendorPaymentReceived(booking, admin, subject) {
        try {
            const adminName = admin.name;
            const vendorEmail = booking.vendor.email;
            const location = JSON.parse(booking.tour.location);
            const templatePath = path.join('src', 'mailTemplates', `vendor-payment-received.hbs`);
            const source = fs.readFileSync(templatePath, 'utf8');
            const compiledTemplate = handlebars_1.default.compile(source);
            const deductedAmount = Math.round(booking.total * 0.98);
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
            };
            const html = compiledTemplate(context);
            await this.transporter.sendMail({
                from: process.env.USER,
                to: vendorEmail,
                subject: subject,
                html: html,
            });
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async vendorFeedbackTour(bookings, subject) {
        try {
            const templatePath = path.join('src', 'mailTemplates', `tour-completed-vendor-feedback.hbs`);
            const source = fs.readFileSync(templatePath, 'utf8');
            const compiledTemplate = handlebars_1.default.compile(source);
            bookings.forEach(async (booking) => {
                const link = `${process.env.APP_URL}feedback?booking_id=${booking._id}&user_id=${booking.user._id}`;
                const context = {
                    user: booking.user.name,
                    vendor: booking.vendor.name,
                    link: link
                };
                const vendorEmail = booking.vendor.email;
                const html = compiledTemplate(context);
                await this.transporter.sendMail({
                    from: process.env.USER,
                    to: vendorEmail,
                    subject: subject,
                    html: html,
                });
            });
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async userFeedbackTour(bookings, subject) {
        try {
            const templatePath = path.join('src', 'mailTemplates', `tour-completed-user-feedback.hbs`);
            const source = fs.readFileSync(templatePath, 'utf8');
            const compiledTemplate = handlebars_1.default.compile(source);
            bookings.forEach(async (booking) => {
                const link = `${process.env.APP_URL}feedback?booking_id=${booking._id}&vendor_id=${booking.vendor._id}`;
                const context = {
                    tour: booking.tour.name,
                    user: booking.user.name,
                    vendor: booking.vendor.name,
                    link: link
                };
                const userEmail = booking.user.email;
                const html = compiledTemplate(context);
                await this.transporter.sendMail({
                    from: process.env.USER,
                    to: userEmail,
                    subject: subject,
                    html: html,
                });
            });
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async tourBookingRequestForVendor(email, name, username, useremail, tourname, dates, subject) {
        try {
            const formatDate = (dates) => {
                if (typeof dates === 'string' && dates.startsWith('[')) {
                    try {
                        dates = JSON.parse(dates);
                    }
                    catch (e) {
                        console.error('Error parsing dates:', e);
                        return '';
                    }
                }
                if (Array.isArray(dates)) {
                    return dates.map(date => moment(date).format('YYYY-MM-DD')).join(',');
                }
                else {
                    return moment(dates).format('YYYY-MM-DD');
                }
            };
            const formattedDates = formatDate(dates);
            const templatePath = path.join('src', 'mailTemplates', `booking-request.hbs`);
            const source = fs.readFileSync(templatePath, 'utf8');
            const compiledTemplate = handlebars_1.default.compile(source);
            const context = {
                name,
                username,
                useremail,
                tourname,
                dates: formattedDates
            };
            const html = compiledTemplate(context);
            await this.transporter.sendMail({
                from: process.env.USER,
                to: email,
                subject: subject,
                html: html,
            });
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async approveTourBookingRequestStatus(email, name, tourname, vendorname, link, date, dates, subject) {
        try {
            const formatDate = (dateString) => {
                return moment(dateString).format('YYYY-MM-DD');
            };
            const templatePath = path.join('src', 'mailTemplates', `approve-booking-request-status.hbs`);
            const source = fs.readFileSync(templatePath, 'utf8');
            const compiledTemplate = handlebars_1.default.compile(source);
            const context = {
                name,
                link,
                tourname,
                vendorname,
                dates: date ? formatDate(date) : dates.map(dateStr => formatDate(dateStr))
            };
            const html = compiledTemplate(context);
            await this.transporter.sendMail({
                from: process.env.USER,
                to: email,
                subject: subject,
                html: html,
            });
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async rejectedTourBookingRequestStatus(email, name, description, tourname, vendorname, subject) {
        try {
            const templatePath = path.join('src', 'mailTemplates', `reject-tour-booking-request.hbs`);
            const source = fs.readFileSync(templatePath, 'utf8');
            const compiledTemplate = handlebars_1.default.compile(source);
            const context = {
                name,
                tourname,
                vendorname,
                description
            };
            const html = compiledTemplate(context);
            await this.transporter.sendMail({
                from: process.env.USER,
                to: email,
                subject: subject,
                html: html,
            });
            console.log('mail send successfully');
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async updateTermsCondition(email, name, link, subject) {
        try {
            const templatePath = path.join('src', 'mailTemplates', `update-terms-condition.hbs`);
            const source = fs.readFileSync(templatePath, 'utf8');
            const compiledTemplate = handlebars_1.default.compile(source);
            const context = {
                name,
                link
            };
            const html = compiledTemplate(context);
            await this.transporter.sendMail({
                from: process.env.USER,
                to: email,
                subject: subject,
                html: html,
            });
            console.log('mail send successfully ');
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async termsConditionForNewUser(email, name, link, subject) {
        try {
            const templatePath = path.join('src', 'mailTemplates', `terms-condition.hbs`);
            const source = fs.readFileSync(templatePath, 'utf8');
            const compiledTemplate = handlebars_1.default.compile(source);
            const context = {
                name,
                link
            };
            const html = compiledTemplate(context);
            await this.transporter.sendMail({
                from: process.env.USER,
                to: email,
                subject: subject,
                html: html,
            });
            console.log('mail send successfully ');
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
EmailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], EmailService);
exports.EmailService = EmailService;
//# sourceMappingURL=Email.service.js.map