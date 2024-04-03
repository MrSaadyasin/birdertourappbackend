import { Injectable, UnauthorizedException } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class GoogleStrategy {
  private client: OAuth2Client;

  constructor() {
    this.client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URL
    );
  }

  createConsentUrl() {
    const consentUrl = this.client.generateAuthUrl({
      access_type: 'offline',
      scope: ['email', 'profile'],
    });

    return consentUrl;
  }

  async authenticate(code: string): Promise<any> {
    
    const { tokens } = await this.client.getToken(code);
    this.client.setCredentials(tokens);

    const ticket = await this.client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
   
    const { name, email, picture, sub: google_id } = ticket.getPayload();

    const user = {
      google_id,
      name,
      email,
      picture,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
    };

    return user;
  }
}


@Injectable()
export class GoogleVendorStrategy {
  private client: OAuth2Client;

  constructor() {
    this.client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_VENDOR_REDIRECT_URL
    );
  }

  createConsentUrl() {
    const consentUrl = this.client.generateAuthUrl({
      access_type: 'offline',
      scope: ['email', 'profile'],
    });
    return consentUrl;
  }

  async authenticate(code: string): Promise<any> {
    const { tokens } = await this.client.getToken(code);
  
    this.client.setCredentials(tokens);

    const ticket = await this.client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { name, email, picture, sub: google_id } = ticket.getPayload();

    const user = {
      google_id,
      name,
      email,
      picture,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
    };
    return user;
  }

}
