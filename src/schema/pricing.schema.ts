import * as mongoose from 'mongoose'


export const pricingSchema = new mongoose.Schema({
  vendor : {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  tour: { type: mongoose.Schema.Types.ObjectId, ref: 'Tour'},
  full_day: String,
  half_day: String,
  hourly_bases: String,  
}, {
  timestamps: true,
  versionKey: false
});





