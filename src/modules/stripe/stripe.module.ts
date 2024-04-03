import { Module } from '@nestjs/common';
import Stripe from 'stripe';

@Module({
  providers: [
    {
      provide: 'STRIPE',
      useValue: new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: '2022-11-15',
      }),
    },
  ],
  exports: ['STRIPE'],
})
export class StripeModule {}