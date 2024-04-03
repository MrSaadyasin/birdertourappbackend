import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { userSchema } from '../../schema/user.schema';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { tokenSchema } from '../../schema/token.schema';
import { EmailService } from 'src/Utils/Email.service';
import { GoogleStrategy, GoogleVendorStrategy } from '../../strategies/google.strategy';
import { JwtAuthStrategy } from '../../strategies/jwt-auth.strategy';
import { GetFullUrl } from 'src/Utils/GetFulUrl';
import { FacebookAuthModule } from '@nestjs-hybrid-auth/facebook';
import { FileUploadService } from 'src/Utils/UploadFile.service';
import { DateTimeFormatter } from 'src/Utils/DateTimeFormatter.service';
import { NotificationService } from '../notification/notification.service';
import { DatabaseModule } from 'src/common/database/database.module';




@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.register({
      secret: process.env.SECRET_KEY,
      global: true,             // this mean you don't need to import this JwtModule anywhere else in your application 
      signOptions: { expiresIn: '7d' }
    }),
    DatabaseModule,
    FacebookAuthModule.forRoot({
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: process.env.FACEBOOK_REDIRECT_URL,
      profileFields: ['id', 'emails', 'name']
    }),
  ],

  controllers: [AuthController],
  providers: [AuthService, EmailService,NotificationService, GoogleStrategy, GoogleVendorStrategy, JwtAuthStrategy, GetFullUrl,FileUploadService,DateTimeFormatter],
  exports: [],
})
export class AuthModule {


}
